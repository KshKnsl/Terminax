import { useParams } from 'react-router-dom'

const DeploymentPage = () => {
    const { deploymentId } = useParams<{ deploymentId: string }>()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Deployment Page</h1>
            <p>Deployment ID: {deploymentId}</p>
        </div>
    )
}

export default DeploymentPage