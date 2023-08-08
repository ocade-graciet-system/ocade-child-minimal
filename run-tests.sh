#!/bin/sh

### METTRE EN PLACE HUSKY (permet de lancer des scripts avant un push git et de l'annuler si le script ne passe pas)
### npm install husky --save-dev
### npx husky add .husky/pre-commit "npm run test"
### npx husky add .husky/pre-push "sh ./path/to/your/script.sh"

# Si le fichier package.json n'existe pas
if [ ! -f package.json ]; then
  # Mise en place de husky automatique
  npm install husky --save-dev && npx husky add .husky/pre-push "sh ./run-tests.sh" 
fi

# Si .gitignore n'existe pas
if [ ! -f .gitignore ]; then
  # Créer le fichier .gitignore
  echo "node_modules" > .gitignore
  echo "package-lock.json" >> .gitignore
fi

# Si tests/configs n'existe pas
if [ ! -d tests/configs ]; then
  # Créer le dossier tests/configs
  mkdir -p tests/configs
fi

# Téléchargez PHPUnit s'il n'est pas déjà téléchargé
if [ ! -f tests/configs/phpunit-9.phar ]; then
  wget -O tests/configs/phpunit-9.phar https://phar.phpunit.de/phpunit-9.phar
  chmod +x tests/configs/phpunit-9.phar
fi

# Si phpunit.xml n'existe pas dans tests/configs
if [ ! -f tests/configs/phpunit.xml ]; then
  # Créer le fichier phpunit.xml
  echo '<?xml version="1.0" encoding="UTF-8"?>
  <phpunit
           colors="true"
           verbose="true"
           stopOnFailure="false">
    <testsuites>
      <testsuite name="ocade-matomo">
        <directory>./tests</directory>
      </testsuite>
    </testsuites>
  </phpunit>' > tests/configs/phpunit.xml
fi

# Exécutez les tests pour les plugins
./tests/configs/phpunit-9.phar --configuration tests/configs/phpunit.xml --cache-result-file tests/configs/.phpunit.result.cache ./tests
