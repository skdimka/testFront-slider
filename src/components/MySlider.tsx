import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import {DateValue, MySliderProps } from "../types/Slider"
import '../styles/Slider.scss';


const MySlider: React.FC<MySliderProps> = ({
    minDate,
    maxDate,
    selectedStartDate,
    selectedEndDate,
}) => {

  // Определение базового года на основе минимального года в заданных данных
  const baseYear = Math.min(minDate.year, new Date().getFullYear());
  const dateToIndex = ({ year, month }: DateValue) => (year - baseYear) * 12 + month - 1;

  const [mode, setMode] = useState("allYears");
  const [sliderRange, setSliderRange] = useState<number[]>([dateToIndex(minDate), dateToIndex(maxDate)]);
  const [displayRange, setDisplayRange] = useState<number[]>([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);
  // Для вычисления отоборажаемых меток в режиме "Месяца"
  const [displayRangeMath, setDisplayRangeMath] = useState<number[]>([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);
  

  // Массив месяцев для вывода в тултипах и метках(marks)
  const monthsFullName = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
  const months = monthsFullName.map((month) => month.substring(0,3).toLowerCase());
  const monthsQuarter = months.map((month, index) => index % 3 === 0 || index === 0 ? month : "");

  // Подпись в тултипах
  function formatDate(index: number) {
    const year = Math.floor(index / 12) + baseYear;
    const month = index % 12;
    return `${monthsFullName[month]} ${year}`;
  }

  // Подпись для меток под слайдером(marks)
  function formatDateMarks(index: number, range: number[]) {
    const year = Math.floor(index / 12) + baseYear;
    const month = index % 12;

    const difference = range[1] - range[0];
    const selectedMonths = difference > 35 ? monthsQuarter : months;

    // Если месяц янцварь, выводим год
    if (month === 0) {
      return year.toString();
    } else {
      return selectedMonths[month];
    }
  }
  
  // Режим "Все года"
  function switchToAllYears() {
    setMode("allYears");
    setSliderRange([dateToIndex(minDate), dateToIndex(maxDate)]);
    // Решил оставить слайдеры связанные в две стороны, при выборе месяцев в режиме "Месяца", выбранный диапазон будет и в режиме "Все года"
    setDisplayRange([displayRange[0], displayRange[1]]);

    // Можно сделать сброс к изначально выбранному диапазону
    // setDisplayRange([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);
  }

  // Режим "Месяца"
  function switchToMonths() {
    const startYear = Math.floor(displayRange[0] / 12);
    const endYear = Math.floor(displayRange[1] / 12);
    const min = (startYear) * 12;
    const max = ((endYear) + 1) * 12;
    setSliderRange([min, max]);
    setDisplayRangeMath([min, max]);
    setMode("byMonths");
  }
  
  // С помощью onChange отслеживаем движение ползунка и обновляем "выбранный диапазон"
  function handleRangeChange(event: Event, newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      setDisplayRange(newValue);
    }
  }

  // Создаем массив меток для режима "Все года" в пределах диапазона
  const allYearsMarks = Array.from({ length: maxDate.year - minDate.year + 1 }, (_, index) => ({
      value: dateToIndex({ year: minDate.year + index, month: 0 }), 
      label: (minDate.year + index).toString()
  }));

  // Создаем массив меток для  режима "Месяца" в пределах диапазона
  const allMonthsMarks = Array.from({ length: (maxDate.year - minDate.year + 1) * 12 }, (_, index) => {
      //Добавляем обработку массива, для выявления года
      const isYearLabel = index % 12 === 0;
      return {
        value: index,
        label: (

          <span className="marks"
            style={{
              //Для года добавляем особую стилизацию
              fontWeight: isYearLabel ? 'bold' : 'normal',
              fontSize: isYearLabel ? '0.9rem' : '0.8rem',
            }}
          >
            {formatDateMarks(index, displayRangeMath)}
          </span>
        ),
      };
    });

  return (
    <div className="container">
      {/* При маленьком разрешении решил вывести информацию отдельно, вместо меток */}
      <div className="text-diapazon">
        <p>Доступный диапазон:</p>
        <p>{formatDate(sliderRange[0])} - {formatDate(sliderRange[1])}</p>
        <p>Выбранный диапазон:</p>
        <p>{formatDate(displayRange[0])} - {formatDate(displayRange[1])}</p>
      </div>

      <div className="buttons-container">
        <span className={`button ${mode === 'byMonths' ? '' : 'disabled'}`}
          onClick={mode === 'allYears' ? () => {} : () => switchToAllYears()}
        >Все года</span>
        <span  className={`button ${mode === 'allYears' ? '' : 'disabled'}`}
          onClick={mode === 'byMonths' ? () => {} : () => switchToMonths()}
        >Месяца</span>
      </div>

      <div className="slider-container">
        <Slider 
          className="custom-slider"
          value={displayRange}
          onChange={handleRangeChange}
          min={sliderRange[0]}
          max={sliderRange[1]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatDate(value as number)}
          marks={mode === "allYears" ? allYearsMarks : allMonthsMarks}
        />
    </div>
  </div>
  );
};

export default MySlider;

