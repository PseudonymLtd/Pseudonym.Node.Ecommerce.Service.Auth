#!/bin/bash

read -p "Enter the service name: "  serviceName
read -p "Enter the service non-plural name: "  serviceNameNonPlural
read -p "Enter the service description: "  serviceDescription
read -p "Enter the service port number: "  servicePort
echo "Scaffolding $serviceName on port $servicePort"

node ./build/scaffold.js "$serviceName" "$serviceNameNonPlural" "$serviceDescription" "$servicePort"