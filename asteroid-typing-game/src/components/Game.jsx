import { useState, useEffect } from 'react';
import { Asteroid } from './Asteroid';
import { Stats } from './Stats';

const maxVisibleWords = 5; // Set your own max visible words
const asteroidSpeed = 2; // Adjust speed as needed
let asteroidInterval = 1000; // Interval for asteroid creation

export const Game = () => {
    const [asteroids, setAsteroids] = useState([]);
    const [correctWords, setCorrectWords] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState(0);
    const [level, setLevel] = useState(1);
    const [life, setLife] = useState(100);
    const [gamePaused, setGamePaused] = useState(false);
    const [asteroidUpdateInterval, setAsteroidUpdateInterval] = useState(null);

    const words = [/* your words here */];
    const doubleWords = [/* your double words here */];

    useEffect(() => {
        // Game loop to update asteroids
        const intervalId = setInterval(updateAsteroids, asteroidInterval);
        setAsteroidUpdateInterval(intervalId);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [asteroids]);

    const createAsteroid = () => {
        if (asteroids.length >= maxVisibleWords) return;

        const isDoubleWord = Math.random() < 0.2;
        const word = isDoubleWord
            ? doubleWords[Math.floor(Math.random() * doubleWords.length)]
            : words[Math.floor(Math.random() * words.length)];

        const newAsteroid = {
            id: Date.now(), // Unique ID for the asteroid
            text: word,
            position: { left: Math.floor(Math.random() * 100), top: 0 } // Store position as percentages
        };

        setAsteroids((prev) => [...prev, newAsteroid]);
    };

    const updateAsteroids = () => {
        if (gamePaused) return;

        setAsteroids((prev) => {
            return prev.map((asteroid) => {
                const newTop = asteroid.position.top + asteroidSpeed;
                if (newTop >= 90) { // Assuming 90% is the spaceship's position
                    setLife((l) => l - 20);
                    setIncorrectWords((count) => count + 1);
                    return null; // Remove asteroid if it goes off-screen
                }
                return { ...asteroid, position: { ...asteroid.position, top: newTop } };
            }).filter(Boolean); // Remove null values (asteroids that have gone off-screen)
        });

        if (asteroids.length < maxVisibleWords) {
            createAsteroid();
        }
    };

    const checkWord = (event) => {
        if (event.key === 'Enter') {
            const inputWord = event.target.value.trim();
            event.target.value = ''; // Clear input
            let matched = false;

            setAsteroids((prev) => {
                return prev.filter((asteroid) => {
                    if (asteroid.text === inputWord) {
                        matched = true;
                        setCorrectWords((count) => count + 1);
                        if (doubleWords.includes(inputWord)) {
                            setLife((l) => Math.min(l + inputWord.length, 100)); // Increase life
                        }
                        return false; // Remove matched asteroid
                    }
                    return true; // Keep unmatched asteroids
                });
            });

            if (!matched) {
                setLife((l) => l - inputWord.length); // Damage equal to input length
                setIncorrectWords((count) => count + 1);
            }
        } else if (event.key === 'Escape') {
            setGamePaused((prev) => !prev); // Toggle pause
        }
    };

    useEffect(() => {
        updateLife(); // Update life when it changes
    }, [life]);

    const updateLife = () => {
        if (life <= 0) {
            alert("Game Over!");
            location.reload();
        }
    };

    return (
        <div className="gameArea" onKeyDown={checkWord} tabIndex={0}>
            <Stats correctWords={correctWords} incorrectWords={incorrectWords} level={level} />
            {asteroids.map((asteroid) => (
                <Asteroid key={asteroid.id} text={asteroid.text} style={{ left: `${asteroid.position.left}%`, top: `${asteroid.position.top}%` }} />
            ))}
            <div className="lifeBar" style={{ width: `${life}%` }}></div>
        </div>
    );
}