import { useState, MouseEventHandler } from "react";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ReplayIcon from "@mui/icons-material/Replay";

type Circle = {
  x: number;
  y: number;
};

function App() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [undoCircles, setUndoCircles] = useState<Circle[]>([]);

  const removeLastCircle = () => {
    const lastCircleIndex = circles.length - 1;
    const removedCircle = circles.splice(lastCircleIndex, 1);
    setUndoCircles((prevState) => {
      return [...(prevState as Circle[]).concat(removedCircle)];
    });
  };

  const retrieveLastRemovedCircle = () => {
    const lastCircleIndex = undoCircles.length - 1;
    const retrievedCircle = undoCircles.splice(lastCircleIndex, 1);
    setCircles((prevState) => {
      return [...(prevState as Circle[]).concat(retrievedCircle)];
    });
  };

  const resetCircles = () => {
    setCircles([]);
    setUndoCircles([]);
  };

  const onCircleAdd: MouseEventHandler<HTMLDivElement> = (event) => {
    const xCircle = event.clientX;
    const yCircle = event.clientY;
    const newCircle: Circle = { x: xCircle, y: yCircle };
    setUndoCircles([]);
    setCircles((prevState) => {
      return [...(prevState as Circle[]).concat(newCircle)];
    });
  };

  const undoColor = circles.length ? "action" : "disabled";
  const redoColor = undoCircles.length ? "action" : "disabled";
  const replayColor =
    circles.length || undoCircles.length ? "action" : "disabled";

  return (
    <>
      <header className="narrow-container">
        <UndoIcon
          className={`undo ${circles.length && "active"}`}
          sx={{ fontSize: 40 }}
          onClick={removeLastCircle}
          color={undoColor}
        />
        <ReplayIcon
          className={`replay ${
            (circles.length || undoCircles.length) && "active"
          }`}
          sx={{ fontSize: 40 }}
          color={replayColor}
          onClick={resetCircles}
        />
        <RedoIcon
          className={`redo ${undoCircles.length && "active"}`}
          sx={{ fontSize: 40 }}
          onClick={retrieveLastRemovedCircle}
          color={redoColor}
        />
      </header>
      <div className="circle-container" onClick={onCircleAdd}>
        {circles.map((circle, index) => {
          return (
            <div
              key={index}
              className="circle"
              style={{ top: circle.y - 50, left: circle.x - 50 }}
            ></div>
          );
        })}
      </div>
    </>
  );
}

export default App;
