This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create a `.env` file in the project root with the API base URL:

```dotenv
BASE_URL=http://localhost:8080/api
```

The server exposes only this API address through `/api/config`; it is not an
API key and must not contain secrets. The `.env` file is ignored by Git.
Restart the development server and refresh the browser after changing it.
The image does not need to be rebuilt when the URL changes.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
