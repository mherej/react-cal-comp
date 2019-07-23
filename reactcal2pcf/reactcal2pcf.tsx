import * as React from 'react';
import { addDays, getDateRangeArray } from 'office-ui-fabric-react/lib/utilities/dateMath/DateMath';
import { Calendar, DayOfWeek } from 'office-ui-fabric-react/lib/Calendar';
import { DateRangeType } from 'office-ui-fabric-react/lib/Calendar';

const DayPickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  weekNumberFormatString: 'Week number {0}',
  prevMonthAriaLabel: 'Previous month',
  nextMonthAriaLabel: 'Next month',
  prevYearAriaLabel: 'Previous year',
  nextYearAriaLabel: 'Next year',
  prevYearRangeAriaLabel: 'Previous year range',
  nextYearRangeAriaLabel: 'Next year range',
  closeButtonAriaLabel: 'Close'
};

export interface ICalendarInlineExampleState {
  selectedDate?: Date | null ;
  selectedDateRange?: Date[] | null;
}

export interface ICalendarInlineExampleProps {
  isMonthPickerVisible?: boolean;
  dateRangeType: DateRangeType;
  autoNavigateOnSelection: boolean;
  showGoToToday: boolean;
  showNavigateButtons?: boolean;
  highlightCurrentMonth?: boolean;
  highlightSelectedMonth?: boolean;
  isDayPickerVisible?: boolean;
  showMonthPickerAsOverlay?: boolean;
  showWeekNumbers?: boolean;
  minDate?: Date;
  maxDate?: Date;
  restrictedDates?: Date[];
  showSixWeeksByDefault?: boolean;
  workWeekDays?: DayOfWeek[];
  firstDayOfWeek?: DayOfWeek;
  // Added values
  dateSelected:  Date;
  dateOnchange?:(newDate:Date)=>void;
}

export class CalendarInlineExample extends React.Component<ICalendarInlineExampleProps, ICalendarInlineExampleState> {
  public constructor(props: ICalendarInlineExampleProps) {
    super(props);
    this.state = {
      selectedDate: null,
      selectedDateRange: null,
    };
    this._onDismiss = this._onDismiss.bind(this);
    this._onSelectDate = this._onSelectDate.bind(this);
    this._goNext = this._goNext.bind(this);
    this._goPrevious = this._goPrevious.bind(this);   
    //this._onSelectDate = this._onSelectDate.bind(this)
  }

  public render(): JSX.Element {
    const divStyle: React.CSSProperties = {
      height: 'auto'
    };
    const buttonStyle: React.CSSProperties = {
      margin: '17px 10px 0 0'
    };
    let dateRangeString: string | null = null;
    if (this.state.selectedDateRange) {
      const rangeStart = this.state.selectedDateRange[0];
      const rangeEnd = this.state.selectedDateRange[this.state.selectedDateRange.length - 1];
      dateRangeString = rangeStart.toLocaleDateString() + '-' + rangeEnd.toLocaleDateString();
    }
    return (
      <div style={divStyle}>

        <Calendar
          onSelectDate={this._onSelectDate}
          onDismiss={this._onDismiss}
          isMonthPickerVisible={this.props.isMonthPickerVisible}
          dateRangeType={this.props.dateRangeType}
          autoNavigateOnSelection={this.props.autoNavigateOnSelection}
          showGoToToday={this.props.showGoToToday}
          value={this.state.selectedDate!}
          firstDayOfWeek={this.props.firstDayOfWeek ? this.props.firstDayOfWeek : DayOfWeek.Sunday}
          strings={DayPickerStrings}
          highlightCurrentMonth={this.props.highlightCurrentMonth}
          highlightSelectedMonth={this.props.highlightSelectedMonth}
          isDayPickerVisible={this.props.isDayPickerVisible}
          showMonthPickerAsOverlay={this.props.showMonthPickerAsOverlay}
          showWeekNumbers={this.props.showWeekNumbers}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          restrictedDates={this.props.restrictedDates}
          showSixWeeksByDefault={this.props.showSixWeeksByDefault}
          workWeekDays={this.props.workWeekDays}
        />

      </div>
    );
  }
  private _onDismiss(): void {
    this.setState((prevState: ICalendarInlineExampleState) => {
      return prevState;
    });
  }
  private _goPrevious(): void {
    this.setState((prevState: ICalendarInlineExampleState) => {
      const selectedDate = prevState.selectedDate || new Date();
      const dateRangeArray = getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);
      let subtractFrom = dateRangeArray[0];
      let daysToSubtract = dateRangeArray.length;
      if (this.props.dateRangeType === DateRangeType.Month) {
        subtractFrom = new Date(subtractFrom.getFullYear(), subtractFrom.getMonth(), 1);
        daysToSubtract = 1;
      }
      const newSelectedDate = addDays(subtractFrom, -daysToSubtract);
      return {
        selectedDate: newSelectedDate
      };
    });
  }
  private _goNext(): void {
    this.setState((prevState: ICalendarInlineExampleState) => {
      const selectedDate = prevState.selectedDate || new Date();
      const dateRangeArray = getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);
      const newSelectedDate = addDays(dateRangeArray.pop()!, 1);

      return {
        selectedDate: newSelectedDate
      };
    });
  }
///  event hadler called from when selected new date in the calendar.
  private _onSelectDate = ( date: Date): void => {
    this.setState(
      (prevState:ICalendarInlineExampleState): ICalendarInlineExampleState=>{
        prevState.selectedDate = date;
        return prevState;
      }
    );
    if (this.props.dateOnchange){
      this.props.dateOnchange(date)
    }
  };
  componentWillReceiveProps(p:ICalendarInlineExampleProps):void {//checked 
    this.setState({selectedDate:(p.dateSelected)})
  }
}