export interface DateValue {
    month: number;
    year: number;
  }
  
  export interface MySliderProps {
    minDate: DateValue;
    maxDate: DateValue;
    selectedStartDate: DateValue;
    selectedEndDate: DateValue;
  }
  