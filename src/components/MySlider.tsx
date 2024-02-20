import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import '../styles/Slider.scss';
import {DateValue, MySliderProps } from "../types/Slider"


const MySlider: React.FC<MySliderProps> = ({
    minDate,
    maxDate,
    selectedStartDate,
    selectedEndDate,
}) => {

    // Определение базового года на основе минимального года в данных
  const baseYear = Math.min(minDate.year, new Date().getFullYear());
  const dateToIndex = ({ year, month }: DateValue) => (year - baseYear) * 12 + month - 1;

  const [mode, setMode] = useState("allYears");
  const [sliderRange, setSliderRange] = useState<number[]>([dateToIndex(minDate), dateToIndex(maxDate)]);
  const [displayRange, setDisplayRange] = useState<number[]>([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);

  useEffect(() => {
    setSliderRange([dateToIndex(minDate), dateToIndex(maxDate)]);
    setDisplayRange([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);
  }, [minDate, maxDate, selectedStartDate, selectedEndDate]);
  
  const monthsFullName = [
    "январь", "февраль", "март", "апрель",
    "май", "июнь", "июль", "август",
    "сентябрь", "октябрь", "ноябрь", "декабрь"
  ];
  
  const months: string[] = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  // const monthsOne: string[] = ["янв", "", "мар", "", "май", "", "июл", "", "сен", "", "ноя", ""];
  const monthsTwo: string[] = ["янв", "", "", "апр", "", "", "июл", "", "", "окт", "", ""];


  //Надпись для окна над ползунком
  const formatDate = (index: number) => {
    const year = Math.floor(index / 12) + baseYear;
    const month = index % 12;
    return `${monthsFullName[month]} ${year}`;
  };


  //Подпись для меток под слайдером(marks)
  const formatDateMarks = (index: number, displayRange: number[]) => {
    const year = Math.floor(index / 12) + baseYear;
    const month = index % 12;

    const difference = displayRange[1] - displayRange[0];
    const selectedMonths = difference > 35 ? monthsTwo : months;
    // const selectedMonths = difference > 70 ? monthsTwo : difference > 35 ? monthsOne : months;
    
    if (month === 0) {
      return year.toString();
    } else {
      return selectedMonths[month];
    }
  };
  
    //режим "Все года"
  const switchToAllYears = () => {
    setMode("allYears");
    setSliderRange([dateToIndex(minDate), dateToIndex(maxDate)]);
    setDisplayRange([dateToIndex(selectedStartDate), dateToIndex(selectedEndDate)]);
  };

   //режим "Месяца"
  const switchToMonths = () => {
    console.log("по месяцам")
    const startYear = Math.floor(displayRange[0] / 12);
    const endYear = Math.floor(displayRange[1] / 12);
    const min = (startYear) * 12;
    const max = ((endYear) + 1) * 12;
    setSliderRange([min, max]);
    setMode("byMonths");
  };
  
  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setDisplayRange(newValue);
    }
  };

    // Создаем массив меток на все года в пределах диапазона
    const allYearsMarks = Array.from({ length: maxDate.year - minDate.year + 1 }, (_, index) => ({
      value: dateToIndex({ year: minDate.year + index, month: 0 }), 
      label: (minDate.year + index).toString()
    }));

    // Создаем массив меток для каждого месяца в пределах диапазона
    const allMonthsMarks = Array.from({ length: (maxDate.year - minDate.year + 1) * 12 }, (_, index) => {
      //Добавляем обработку массива, для выявления года
      const isYearLabel = index % 12 === 0;
      return {
        value: index,
        label: (
          
          <Typography
            style={{
              //Для года добавляем особую стилизацию
              fontWeight: isYearLabel ? 'bold' : 'normal',
              fontSize: isYearLabel ? '0.9rem' : '0.8rem',
              textAlign: 'center',
            }}
          >
            {formatDateMarks(index, displayRange)}
          </Typography>
        ),
      };
    });

  return (
    <div className="slider-container">
    <div className="buttons-container">
      <span className={`button ${mode === 'byMonths' ? '' : 'disabled'}`}
        onClick={mode === 'allYears' ? () => {} : () => switchToAllYears()}
      >Все года</span>
      <span  className={`button ${mode === 'allYears' ? '' : 'disabled'}`}
        onClick={mode === 'byMonths' ? () => {} : () => switchToMonths()}
      >Месяца</span>
    </div>
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
  );
};

export default MySlider;

