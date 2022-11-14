import {
  useState,
  MouseEventHandler,
  useEffect,
  TouchEventHandler,
} from "react";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ReplayIcon from "@mui/icons-material/Replay";
import { Circle } from "@mui/icons-material";

type Circle = {
  x: number;
  y: number;
};

const getCircles = (): Circle[] => {
  const circles: Circle[] = [];
  if (localStorage.getItem("circles")) {
    circles.push(...JSON.parse(localStorage.getItem("circles") as string));
  }
  return circles;
};

const getUndoCircles = (): Circle[] => {
  const circles: Circle[] = [];
  if (localStorage.getItem("undo-circles")) {
    circles.push(...JSON.parse(localStorage.getItem("undo-circles") as string));
  }
  return circles;
};

function App() {
  const [circles, setCircles] = useState<Circle[]>(getCircles());
  const [undoCircles, setUndoCircles] = useState<Circle[]>(getUndoCircles());
  const [mouseDown, setMouseDown] = useState<Boolean>(false);

  useEffect(() => {
    localStorage.setItem("circles", JSON.stringify(circles));
    localStorage.setItem("undo-circles", JSON.stringify(undoCircles));
  }, [circles, undoCircles]);

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
    if (mouseDown || event.type === "click") {
      const xCircle = event.clientX;
      const yCircle = event.clientY;
      const newCircle: Circle = { x: xCircle, y: yCircle };
      setUndoCircles([]);
      setCircles((prevState) => {
        return [...(prevState as Circle[]).concat(newCircle)];
      });
    }
  };

  const onCircleAddMobile: TouchEventHandler<HTMLDivElement> = (event) => {
    if (mouseDown || event.type === "click") {
      const xCircle = event.changedTouches[0].clientX;
      const yCircle = event.changedTouches[0].clientY;
      const newCircle: Circle = { x: xCircle, y: yCircle };
      setUndoCircles([]);
      setCircles((prevState) => {
        return [...(prevState as Circle[]).concat(newCircle)];
      });
    }
  };

  const onDrawStart: MouseEventHandler<HTMLDivElement> = (event) => {
    setMouseDown(true);
  };

  const onDrawStartMobile: TouchEventHandler<HTMLDivElement> = (event) => {
    setMouseDown(true);
  };

  const onDrawStop: MouseEventHandler<HTMLDivElement> = (event) => {
    setMouseDown(false);
  };

  const onDrawStopMobile: TouchEventHandler<HTMLDivElement> = (event) => {
    setMouseDown(false);
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
      <div
        className="circle-container"
        onClick={onCircleAdd}
        onMouseDown={onDrawStart}
        onMouseUp={onDrawStop}
        onMouseMove={onCircleAdd}
        onTouchStart={onDrawStartMobile}
        onTouchEnd={onDrawStopMobile}
        onTouchMove={onCircleAddMobile}
      >
        {circles.map((circle, index) => {
          return (
            <div
              key={index}
              className="circle"
              style={{ top: circle.y - 5, left: circle.x - 5 }}
            ></div>
          );
        })}
      </div>
    </>
  );
}

export default App;
