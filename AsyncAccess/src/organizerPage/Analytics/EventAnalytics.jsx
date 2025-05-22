import { useParams } from 'react-router-dom';

function EventAnalytics() {
    const { id } = useParams();

    return (
        <div>
        <h1>Event Analytics</h1>
        <p>Event ID: {id}</p>
        {/* Add your analytics content here */}
        </div>
    );
}

//6826e5fe7bada549750335bd
//6826e69d7bada549750335c7
//6828dd930b86c3e09e45b3db
//682f3dd7b32497a70fa5b3c7