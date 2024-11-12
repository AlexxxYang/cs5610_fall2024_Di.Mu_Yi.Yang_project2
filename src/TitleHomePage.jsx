import { Link } from "react-router-dom";
import './TitleHomePage.css';

export default function TitleHomePage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">MineSweeper</h1>
      <div className="link-container">
        <Link to="/game/easy" className="game-link">Play Easy</Link>
        <Link to="/game/medium" className="game-link">Play Medium</Link>
        <Link to="/game/hard" className="game-link">Play Hard</Link>
        <Link to="/rules" className="rules-link">How to Play</Link>
      </div>
    </div>
  );
}