import { useNavigate } from "react-router-dom";
import { startConversation } from "../services/chatApi";

function JobCard({ job }) {

    const navigate = useNavigate();

    async function handleMessageClick(otherUserId) {
        try {
            const conversation = await startConversation(otherUserId);
            navigate("/chat", { state: { conversation } }); // or however you route
        } catch (err) {
            alert(err.response?.data?.error || "Unable to start conversation");
        }
    }

    return (
        <div className="job-card">

            <h2>{job.title}</h2>

            <p><strong>Job ID:</strong> {job.id}</p>

            <h4>{job.company}</h4>

            <p>{job.location}</p>

            <p>{job.salary}</p>

            <div className="job-card-skills">

                {job.skills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                ))}

            </div>

            <button
                className="btn-primary"
                onClick={() => navigate(`/jobs/${job.id}`)}
            >
                View Details
            </button>

        </div>
    );
}

export default JobCard;