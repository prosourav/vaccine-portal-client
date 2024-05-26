import { Calendar as BigCalendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface CalendarProps {
  events: Event[];
}

interface CustomCalendarProps extends CalendarProps {
  handleEventClick: (event: Event) => void;
}

const eventStyleGetter = (event: Event) => {
  const backgroundColor = event.title === 'Available' ? 'green' : 'blue'; // Change color as needed
  const style = {
    backgroundColor,
    color: 'white',
    borderRadius: '0px',
    border: 'none',
    display: 'block',
  };
  return {
    style,
  };
};

const Calendar: React.FC<CustomCalendarProps> = ({ events, handleEventClick }) => {

  return (
    <div className="bg-white px-4 shadow-md rounded-md pb-2">
      <h1 className="text-2xl font-bold mb-4 p-2">Appointment Calendar</h1>
      <div className="sm:hidden ">
        {/* For mobile screens */}
        {/* <BigCalendar
          localizer={localizer}
          events={events}
          views={[Views.MONTH]}
          onSelectEvent={handleEventClick}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          eventPropGetter={eventStyleGetter}
        /> */}
      </div>
      <div className="hidden sm:block md:hidden">
        {/* For tablets */}
        {/* <BigCalendar
          localizer={localizer}
          events={events}
          views={[Views.MONTH]}
          onSelectEvent={handleEventClick}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
        /> */}
      </div>
      <div className="hidden md:block">
        {/* For desktop */}
        <BigCalendar
          localizer={localizer}
          events={events}
          views={[Views.MONTH]}
          onSelectEvent={handleEventClick}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 550 }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default Calendar;
