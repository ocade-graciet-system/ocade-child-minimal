#!/bin/bash

# Demande pour les fichiers à ajouter, avec une valeur par défaut de "."
read -p "Fichier(s) add (.): " add
add=${add:-"."}

# Demande pour les fichiers à commit, avec une valeur par défaut de "."
read -p "Fichier(s) commit (.): " commit
commit=${commit:-"."}

# Demande pour le message de commit, avec une valeur par défaut de "🤔 Rien à signaler"
read -p "Message commit (🤔 Rien à signaler): " message
message=${message:-"🤔 Rien à signaler"}

# Demande pour la branche, avec une valeur par défaut de "master"
read -p "Branch (master): " branch
branch=${branch:-"master"}

# Exécute les commandes Git avec les valeurs fournies
npm test && git fetch origin master && git checkout FETCH_HEAD -- style.css && sleep 5 && git add $add && git commit $commit -m "$message" && git pull origin $branch && git add $add && git commit && git push origin $branch --force