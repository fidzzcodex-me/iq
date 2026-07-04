import ShapeIcon from './ShapeIcon';

export default function VisualPuzzle({ question, selected, onSelect, disabled }) {
  if (question.visualType === 'odd-shape-out') {
    return (
      <div>
        <div className="shape-grid">
          {question.shapes.map((s) => {
            const id = String(s.id);
            const isSelected = selected === id;
            return (
              <button
                key={s.id}
                className={`shape-cell ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(id)}
                disabled={disabled}
              >
                <ShapeIcon shape={s.shape} color={s.color} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.visualType === 'count-shapes') {
    return (
      <div>
        <div className="shape-grid dense">
          {question.shapes.map((s) => (
            <div key={s.id} className="shape-cell static">
              <ShapeIcon shape={s.shape} color={s.color} size={34} />
            </div>
          ))}
        </div>
        <div className="option-grid" style={{ marginTop: 20 }}>
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === opt;
            return (
              <button
                key={opt}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(opt)}
                disabled={disabled}
              >
                <span className="option-letter">{letter}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.visualType === 'shape-sequence') {
    return (
      <div>
        <div className="shape-sequence-row">
          {question.shapes.map((s) => (
            <div key={s.id} className="shape-cell static">
              <ShapeIcon shape={s.shape} color={s.color} />
            </div>
          ))}
          <div className="shape-cell question-mark">?</div>
        </div>
        <div className="shape-grid" style={{ marginTop: 20 }}>
          {question.optionShapes.map((s) => {
            const id = String(s.id);
            const isSelected = selected === id;
            return (
              <button
                key={s.id}
                className={`shape-cell ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(id)}
                disabled={disabled}
              >
                <ShapeIcon shape={s.shape} color={s.color} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
