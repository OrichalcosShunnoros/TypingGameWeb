import { Game } from './components/Game';
import { Sidebar } from './components/Sidebar';
import { HighScore } from './components/HighScore';
import './styles/styles.css';

export const App = () => {
    return (
        <div className="app">
            <Sidebar />
            <Game />
            <HighScore />
        </div>
    );
}
