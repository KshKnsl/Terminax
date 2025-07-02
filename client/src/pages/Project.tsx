import { useParams } from 'react-router-dom';
const Project = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>Project</div>
  )
}

export default Project