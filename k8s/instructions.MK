Kind site: https://kind.sigs.k8s.io/docs/user/quick-start/

Instale o kubectl

kind create cluster --config=k8s/kind.yaml --name=poc-websocket

kubectl cluster-info --context kind-poc-websocket

kubectl get nodes 

kubectl config get-clusters  

kubectl config use-context kind-poc-websocket

docker build -t ocnascimento/poc_websocket:v1.0 .

docker run --rm -p 3000:3000 ocnascimento/poc_websocket:v1.0

docker push ocnascimento/poc_websocket:v1.0

kubectl apply -f k8s/pod.yaml 

kubectl get pods 

kubectl get po

# Maneira alternativa pra acessar o pod com redirecionamento de portas
kubectl port-forward pod/nodeserver 3000:3000

kubectl delete pod nodeserver 

kubectl apply -f k8s/replicaset.yaml 

kubectl get replicasets

kubectl describe pod nodeserver-8z5tt

kubectl delete replicaset nodeserver 

kubectl apply -f k8s/deployment.yaml

kubectl rollout history deployment nodeserver

# Volta pra ultima versão
kubectl rollout undo deployment nodeserver 
# Volta pra ultima versão informada
kubectl rollout undo deployment nodeserver --to-revision=1

kubectl apply -f k8s/service.yaml

kubectl get services

kubectl get svc

kubectl port-forward service/nodeserver-service 3000:3000

# Acessar o kubernets direto com proxy
kubectl proxy --port=8080

kubectl exec -it nodeserver-848799f866-jqrld -- bash

kubectl logs nodeserver-848799f866-jqrld 

echo "orlando" | base64 
echo "MDEwMjAzMDQK" | base64 --decode

kubectl apply -f k8s/deployment.yaml && watch -n1 kubectl get pods

kubectl get apiservices

kubectl top pod nodeserver-86f565c6f6-r4shs

kubectl get hpa  

kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 800 -t 120s -c 70 "http://goserver-service/healthz"

watch -n1 kubectl get hpa   

kubectl get storageclass

kubectl get all  

 kubectl apply -f k8s/

 Cloud (GCP, Azure, AWS, outros)

 Install helm
 curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm.list

sudo apt-get update
sudo apt-get install helm

helm version

 Install ingress-nginx

```sudo snap install helm --classic ```

``` helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
		helm repo update
		helm -n ingress-nginx install ingress-nginx ingress-nginx/ingress-nginx --create-namespace

```

kubectl get ns (namespace)