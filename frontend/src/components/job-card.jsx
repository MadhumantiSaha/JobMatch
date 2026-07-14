import { useNavigate } from "react-router-dom";

function JobCard({ job }) {

    const navigate = useNavigate();

    return (
        <div className="job-card">

            <h2>{job.title}</h2>

            <p><strong>Job ID:</strong> {job.id}</p>

            <h4>{job.company}</h4>

            <p>{job.location}</p>

            <p>{job.salary}</p>

            <div className="skills">

                {job.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}

            </div>

            <button
                onClick={() => navigate(`/jobs/${job.id}`)}
            >
                View Details
            </button>

        </div>
    );
}

export default JobCard;