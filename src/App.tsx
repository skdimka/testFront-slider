import MySlider from "./components/MySlider";

// В задании не требуется выводить на экране форму для ввода данных, поэтому
// задаем данные для передачи в компонент слайдера здесь
const minDate = { month: 12, year: 2013 };
const maxDate = { month: 1, year: 2021 };
const selectedStartDate = { month: 5, year: 2015 };
const selectedEndDate = { month: 2, year: 2016 };

// Передаю данные в компонент MySlider в качестве пропсов
const App = () => {
  return (
    <MySlider 
      minDate={minDate}
      maxDate={maxDate}
      selectedStartDate={selectedStartDate}
      selectedEndDate={selectedEndDate}
      />
  );
};

export default App;