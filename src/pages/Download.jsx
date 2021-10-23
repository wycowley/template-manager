import { useEffect } from "react";
import { useParams } from "react-router";
const Dashboard = (props) => {
    let { id } = useParams();
    let { userId } = useParams();

    useEffect(() => {
        console.log(id, userId);
    }, []);
    return <div>Download</div>;
};

export default Dashboard;
