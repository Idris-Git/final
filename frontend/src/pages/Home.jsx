import b1 from "../assets/b1.png";
import b2 from "../assets/b2.jpg";
import "../styles/Home.css";
function Home() {
    return (
        <div className="page">
            <h1>Welcome to Blood Donation System</h1>
            <p>This system helps hospitals find blood donors quickly.</p>
            <h3>Awareness Posts</h3>
            <div id="posts">
                <img src={b1} alt="Blood donation awareness" />
                <img src={b2} alt="Community blood drive" />
            </div>
            
        </div>
    );
}

export default Home;
