import './styles/App.css';
import Upload from "./components/upload/Upload";

const onClickHandler = (event) => {
    event.preventDefault();
    console.log(111111)
}
function App() {
  return (
    <div className="App">
      <Upload/>
        <button onClick={onClickHandler}>Click me</button>
    </div>
  );
}

export default App;
