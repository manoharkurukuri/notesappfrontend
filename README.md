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

Build the production image without environment-specific configuration, then pass
the API URL when starting the container:

```bash
docker build -t mkurukuri/notesappfrontend:v1 .
docker run --rm -p 3000:3000 --env-file .env mkurukuri/notesappfrontend:v1
```

Open [http://localhost:3000](http://localhost:3000). The container runs the
Next.js standalone server as a non-root user.

Alternatively, pass the URL directly:

```bash
docker run --rm -p 3000:3000 \
  -e API_URL=http://16.113.14.5/api \
  mkurukuri/notesappfrontend:v1
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

The Helm chart creates `notesappfrontend-config` in the release namespace.
Set its URL in `helm/notesappfrontend/values.yaml`:

```yaml
configMap:
  apiUrl: "https://api.example.invalid/api"
```

The default is deliberately a dummy URL. Replace it with your browser-accessible
backend URL before using the app. The Deployment already references the ConfigMap:

```yaml
containers:
  - name: notesappfrontend
    image: mkurukuri/notesappfrontend:v1
    ports:
      - containerPort: 3000
    env:
      - name: API_URL
        valueFrom:
          configMapKeyRef:
            name: notesappfrontend-config
            key: API_URL
```

Commit and push URL changes for Argo CD to sync them. A ConfigMap checksum in the
Deployment automatically restarts pods when the chart configuration changes;
reload the browser afterward. Do not edit the live ConfigMap directly because
Argo CD self-healing will restore the Git value. The same image can be used in
every environment without rebuilding.

### Helm deployment

The chart manages the ConfigMap; no separate ConfigMap creation is needed:

```bash
helm lint helm/notesappfrontend
helm upgrade --install notesappfrontend ./helm/notesappfrontend \
  --namespace notesapp --create-namespace \
  --set-string configMap.apiUrl=http://16.113.14.5/api --wait
kubectl -n notesapp port-forward service/notesappfrontend 3000:80
```

The chart uses the image tag committed by CI (the GitHub Actions run ID).
The workflow builds both amd64 and arm64 images and updates the chart
tag, but applying that chart still requires Helm or a GitOps controller.

The Service exposes port 80 and forwards to container port 3000. Overriding
`containerPort` also updates the server's `PORT` environment variable; do not
set `PORT` separately in `env`. Startup and liveness probes check `/`, while
readiness checks `/api/runtime-config` so invalid API configuration prevents
traffic from reaching the pod without causing a restart loop.

No custom ServiceAccount is created, and service account token mounting is
disabled. Containers run as UID/GID 1000 with a read-only root filesystem and
writable temporary/cache volumes. Resource requests and limits are starting
values; measure memory and CPU under your expected load before production.

Autoscaling is disabled by default. Enable it with
`--set autoscaling.enabled=true` only when resource metrics are available in the
cluster. Ingress and HTTPRoute are also disabled by default; configure the
matching controller/Gateway and a real hostname before enabling either.
After a chart-managed ConfigMap update, pods roll out automatically; reload the
browser. Readiness validates the URL format, not backend connectivity, so the
dummy URL allows startup but does not provide working API requests.

## GitHub Actions

The frontend workflow builds the app, runs ESLint, and audits dependencies for
high/critical findings on application pushes and pull requests targeting `main`.
There is currently no automated test suite; the workflow does not claim to run
tests. Manual runs on other branches validate the app but cannot publish an
image or change the chart on `main`.

Successful runs on `main` publish a multi-platform Docker image and commit its
tag to the Helm values. Configure these repository Actions secrets:

- `DOCKERHUB_USERNAME`: an account authorized to push to
  `mkurukuri/notesappfrontend`.
- `DOCKERHUB_TOKEN`: a Docker Hub access token with read/write permission.

The chart-update job needs permission to push to `main`. Repository rules or
branch protection may require a pull-request-based update instead. No Kubernetes
credentials are used: deployment still requires Helm or a GitOps controller.

Chart-only changes run the separate Helm-check workflow without rebuilding the
image. It lints and renders the default chart and the optional autoscaling,
Ingress, and HTTPRoute configurations.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
