export const Stats = ({ correctWords, incorrectWords, level }) => {
    return (
        <div className="stats">
            <p><strong>Palabras Correctas:</strong> {correctWords}</p>
            <p><strong>Palabras Incorrectas:</strong> {incorrectWords}</p>
            <p><strong>Nivel:</strong> {level}</p>
        </div>
    );
}