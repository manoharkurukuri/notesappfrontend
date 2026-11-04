This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create a `.env` file in the project root:

```dotenv
API_URL=http://16.113.14.5/api
```

The server exposes only this public URL through `/api/runtime-config`, and the
browser's API client loads it before its first request. Do not put secrets in it.
The `.env` file is ignored by Git. Restart the server and reload the browser after
changing the value. No rebuild is needed.

`BASE_URL` remains supported for existing deployments when `API_URL` is unset.
If both are set, `API_URL` takes precedence. The legacy `/api/config` endpoint
continues to expose `BASE_URL` for existing callers.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker

### Standalone Docker and Kubernetes manifests

Build the production image without any API address or secrets:

```bash
docker build -t notesappfrontend:1.0 .
docker run --rm -p 3000:3000 \
  -e BASE_URL=http://localhost:8080/api \
  notesappfrontend:1.0
```

Open [http://localhost:3000](http://localhost:3000). The image uses Next.js
standalone output and runs as a non-root user on port 3000. Local `.env` files
are excluded from the image.

`BASE_URL` is read at runtime through `/api/config` before the first backend
request and is cached in the browser until the page is refreshed. Failed
configuration requests are retried on the next API operation. Without a
configured URL, the frontend still starts, but API operations fail with an
explicit configuration error until the backend address is provided.

Use an API URL that users' browsers can reach. The backend must allow your
frontend origin through CORS when they are hosted on different origins.
`localhost` refers to the user's computer, not a backend container or
Kubernetes Service. Do not put secrets in this value.

### Push to Docker Hub and deploy to Kubernetes

Create a public Docker Hub repository named `notesappfrontend` under
`mkurukuri`, then run these commands from the project root:

```bash
docker login --username mkurukuri

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t mkurukuri/notesappfrontend:1.0 \
  --push .

docker buildx imagetools inspect mkurukuri/notesappfrontend:1.0
```

Enter your Docker Hub personal access token at the login prompt. Do not
store it in this repository. The build publishes images for both common
Kubernetes node architectures, including ARM-based local clusters and
x86-based cloud clusters.

[The frontend deployment](k8s/frontend-deployment.yaml) already references
`mkurukuri/notesappfrontend:1.0` with `imagePullPolicy: Always`.
If the repository is private, configure a Kubernetes registry Secret and
`imagePullSecrets` on the deployment before deploying.

Confirm the intended Kubernetes context, then apply the manifests:

```bash
kubectl config current-context
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/frontend-configmap.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl rollout status deployment/frontend -n notes-app
kubectl get pods -n notes-app
```

To access the frontend locally without a Service:

```bash
kubectl port-forward deployment/frontend 3000:3000 -n notes-app
```

Open [http://localhost:3000](http://localhost:3000).

When the backend is ready, set `data.BASE_URL` in
[the frontend ConfigMap](k8s/frontend-configmap.yaml) to its browser-accessible
API address (for example, `https://api.example.com/api`). Then apply the
ConfigMap and restart the frontend Pods so they receive the new environment:

```bash
kubectl apply -f k8s/frontend-configmap.yaml
kubectl rollout restart deployment/frontend -n notes-app
kubectl rollout status deployment/frontend -n notes-app
```

Refresh the browser afterward. No image rebuild is required.

For future code releases, build and push a new tag, update the deployment
image, and apply the deployment again. If you reuse the same tag, existing
Pods need a rollout restart to pull it:

```bash
kubectl rollout restart deployment/frontend -n notes-app
kubectl rollout status deployment/frontend -n notes-app
```

## Tests

Run `npm test` with Node.js 22.6 or newer to check runtime configuration.
### Docker and Helm deployment

Build the production image without environment-specific configuration, then pass
the API URL when starting the container:

```bash
docker build -t mkurukuri/notes-frontend:v1 .
docker run --rm -p 3000:3000 --env-file .env mkurukuri/notes-frontend:v1
```

Open [http://localhost:3000](http://localhost:3000). The container runs the
Next.js standalone server as a non-root user.

Alternatively, pass the URL directly:

```bash
docker run --rm -p 3000:3000 \
  -e API_URL=http://16.113.14.5/api \
  mkurukuri/notes-frontend:v1
```

Environment files are excluded from the Docker build context. `API_URL` is
required at runtime and must be reachable from the user's browser, not just from
the container. Use a public URL rather than a Kubernetes-internal service name,
and HTTPS when the frontend uses HTTPS. The backend must allow the frontend
origin through CORS. Missing or invalid configuration returns an explicit error
from `/api/runtime-config` instead of sending API requests to the frontend.
If your Ingress routes `/api` to the backend, add a more specific route for
`/api/runtime-config` to the frontend service.

### Kubernetes ConfigMap

The Helm chart now lives in
[`manoharkurukuri/devops-helm`](https://github.com/manoharkurukuri/devops-helm),
under `helm-notes-app`. Set the runtime backend URL in that chart's `values.yaml`:

```yaml
frontend:
  env:
    API_URL: "http://192.168.252.12:30080/api"
```

Use a node address and gateway port reachable from the browser. The URL must end
in `/api`, not `/api/auth`. The chart creates `<release-name>-frontend-config`
and loads it into the frontend Deployment.

Commit and push URL changes for Argo CD to sync them. A ConfigMap checksum in the
Deployment automatically restarts pods when the chart configuration changes;
reload the browser afterward. Do not edit the live ConfigMap directly because
Argo CD self-healing will restore the Git value. The same image can be used in
every environment without rebuilding.

### Helm deployment

Argo CD's `fullstack-dev` Application tracks the GitOps repository's `main`
branch, chart path `helm-notes-app`, and both dev overrides. To validate locally,
run these commands from the GitOps repository:

```bash
helm lint helm-notes-app \
  -f helm-notes-app/environments/dev/frontend.yaml \
  -f helm-notes-app/environments/dev/backend.yaml
helm template fullstack helm-notes-app --namespace devops-app \
  -f helm-notes-app/environments/dev/frontend.yaml \
  -f helm-notes-app/environments/dev/backend.yaml
```

The local chart uses Envoy Gateway with NodePort `30080` and internal ClusterIP
app Services. Open `http://192.168.252.12:30080` after sync. If the gateway port
changes, update `frontend.env.API_URL` as well. The HTTPRoute sends `/api` to the
backend but keeps `/api/runtime-config` and `/api/config` on the frontend.

## GitHub Actions

The workflow in `.github/workflows/ci-cd.yaml` installs dependencies, runs
`npm test`, builds the app, runs ESLint, and audits dependencies for high/critical
findings on pushes and pull requests targeting `main`. CI uses Node.js 24 to
match the Docker image. Manual runs on other branches validate the app but
cannot publish an image or change the GitOps repository.

Successful runs on `main` publish
`mkurukuri/notes-frontend:<run-id>-<run-attempt>` for amd64 and arm64. CI then
checks out `manoharkurukuri/devops-helm`, updates only `frontend.image.tag` in
`helm-notes-app/environments/dev/frontend.yaml`, validates the chart, and pushes
the update to `main`. This override is the one Argo CD actually reads; updating
only the base values would leave the dev image tag unchanged.

Configure these Actions secrets in the **frontend repository**:

- `DOCKERHUB_USERNAME`: an account authorized to push to
  `mkurukuri/notes-frontend`.
- `DOCKERHUB_TOKEN`: a Docker Hub access token with read/write permission.
- `GITOPS_TOKEN`: a fine-grained GitHub token restricted to
  `manoharkurukuri/devops-helm` with **Contents: read and write**. The frontend's
  default `GITHUB_TOKEN` cannot push to another repository.

The backend `NotesApi` workflow needs the same three secret names. Use
`mkurukuri` for `DOCKERHUB_USERNAME` if publishing with that Docker Hub account,
and tokens authorized for the corresponding image repository. Separate tokens
per source repository are recommended. Neither workflow requires repository
Actions variables: image repositories, GitOps repository, branch, and chart
paths are already configured in the workflows.

The backend publishes `mkurukuri/notes-backend:<run-id>-<run-attempt>` and updates
`backend.image.tag` in `helm-notes-app/environments/dev/backend.yaml`. Its CI runs
Java 21 tests against a temporary MongoDB service with a public test-only JWT
key. Production `DB_URL` and `JWT_SECRET` stay in AWS Secrets Manager and are
synced by External Secrets Operator into `backend-secrets` in `devops-app`.
Do not add these production values or AWS access keys to either CI workflow.

The GitOps token owner must be allowed to push to `devops-helm/main`; if branch
protection requires pull requests, adapt the workflow to open a PR instead.
Never commit tokens. No Kubernetes or AWS credentials are needed in this
workflow: Argo CD polls Git and deploys the updated tag.

Helm validation now lives in `.github/workflows/helm-check.yml` in the GitOps
repository and runs for chart changes, including CI's image-tag commits. Commit
and push that workflow in `devops-helm` separately; there is no Helm chart left
in this frontend repository.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
