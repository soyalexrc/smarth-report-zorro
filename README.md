build image

docker build -t pruebacontainerluighi2693/smart-report-frontend:latest .

push dockerhub

docker push pruebacontainerluighi2693/smart-report-frontend:latest


publish server side 

docker stop $(docker ps | grep 'smart-report-frontend:latest' | awk '{print $1}')
docker rm $(docker ps -a | grep 'smart-report-frontend:latest' | awk '{print $1}')
docker image rm $(docker image ls | grep 'pruebacontainerluighi2693/smart-report-frontend' | grep -v 'site' | awk '{print $3}')
docker run -d -p 8081:80 pruebacontainerluighi2693/smart-report-frontend:latest
