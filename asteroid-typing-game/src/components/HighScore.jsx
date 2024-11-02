import React from 'react';

export const HighScore = ({ maxCorrectWords, maxLevel }) => {
    return (
        <div className="highScore">
            <h2>Mejor Puntuación</h2>
            <p>Máx. Palabras Correctas: {maxCorrectWords}</p>
            <p>Máx. Nivel: {maxLevel}</p>
        </div>
    );
}