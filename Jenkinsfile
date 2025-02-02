pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'Eissanoor-Credentials', 
                        url: 'https://github.com/Eissanoor/QMS-V2.git'
                    ]]
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies for QMS V2 Frontend..."
                bat 'npm ci' // Use 'sh' instead of 'bat' for Unix systems
            }
        }

        stage('Generate Build') {
            steps {
                echo "Generating build for QMS V2 Frontend..."
                bat 'npm run build' // Use 'sh' instead of 'bat' for Unix systems
            }
        }

        stage('Create web.config') {
            steps {
                script {
                    def webConfigContent = '''<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Router" stopProcessing="true">
          <match url="^(?!.\\.\\w{2,4}$)(.)$" />
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>'''

                    writeFile(file: 'dist/web.config', text: webConfigContent)
                }
            }
        }
    }
}