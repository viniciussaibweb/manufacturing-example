import React, {
  useEffect,
  useRef,
  ChangeEvent,
  useState,
  SyntheticEvent,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment, { Moment } from "moment";
import { Container, ContainerDatePicker } from "./styles";
import { ptBR } from "date-fns/locale";
import { setHours, setMinutes } from "date-fns";

interface DatePickerInputProps {
  onChangeDate: (
    date: Date | Moment | null,
    event?: SyntheticEvent<any, Event> | undefined
  ) => void;
  value?: Moment;
  minTime?: Moment;
  selected?: Date;
  label: string;
  dateAndTime?: boolean;
  maxDate?: moment.Moment;
  minDate?: moment.Moment;
  readOnly?: boolean;
  onDateMatch?: (date: string) => void;
  rest?: any;
  onChange?: (date: Moment) => void;
}

export default function DatePickerInput({
  onChangeDate,
  value,
  dateAndTime,
  label,
  maxDate,
  minDate,
  minTime,
  readOnly,
  ...rest
}: DatePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [classes, setClasses] = useState<string>("input_cad");
  const [date, setDate] = useState<Moment>(moment());
  const [maxTime, setMaxTime] = useState<Moment | null>(null);
  const [dateFormated, setDateFormated] = useState<string>(
    value && moment.isMoment(value) ? value.format("DD/MM/YYYY") : ""
  );

  useEffect(() => {
    if (value && moment.isMoment(value)) {
      const formated = dateAndTime
        ? value.format("DD/MM/YYYY HH:mm:ss")
        : value.format("DD/MM/YYYY");

      setDate(value);
      setDateFormated(formated);
    } else {
      setDate(moment());
      setDateFormated(moment().format("DD/MM/YYYY"));
    }

    if (dateAndTime && maxDate) {
      setMaxTime(moment(maxDate));
    }
  }, [value, dateAndTime]);
  if (maxDate && typeof maxDate !== "object") {
    maxDate = moment(maxDate);
  }
  if (minDate && typeof minDate !== "object") {
    minDate = moment(minDate);
  }
  const onDateMatch = (dateInput: string) => {
    try {
      let newDate: Moment;
      if (dateAndTime) {
        const arrDateAndTime = dateInput.split(" ");
        const arrDate = arrDateAndTime[0].split("/").reverse().join("/");
        const newDateTime = `${arrDate} ${arrDateAndTime[1]}`;

        newDate = moment(newDateTime, "DD/MM/YYYY HH:mm:ss");
      } else {
        const arrDate = dateInput.split("/").reverse().join("/");
        newDate = moment(arrDate, "DD/MM/YYYY");
      }

      onChangeDate(newDate);
    } catch (err) {
      onChangeDate(moment());
    }
  };
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const { value: inputValue } = event.target;

      setDateFormated(inputValue || "");
      const valueMoment = moment(inputValue);

      if (maxDate) {
        if (valueMoment.isAfter(moment(maxDate))) {
          throw new Error("Valor informado ultrapassa a data máxima");
        }
      }

      if (minDate) {
        if (valueMoment.isBefore(moment(minDate))) {
          throw new Error("valor informado antecede a data mínima!");
        }
      }

      let regex;
      if (dateAndTime) {
        regex = new RegExp(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
      } else {
        regex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
      }

      if (!regex.test(inputValue)) {
        throw new Error("Data inválida");
      }

      setClasses("input_cad");
      onDateMatch(inputValue);
    } catch (err) {
      setClasses("input_cad input_error");
    }
  };

  let maxTimes: Date | null = null;
  if (maxDate) {
    maxTimes = setHours(
      setMinutes(
        new Date(),
        moment(maxDate).hours() === 0 ? 59 : moment(maxDate).minutes()
      ),
      moment(maxDate).hours() === 0 ? 23 : moment(maxDate).hours()
    );
  } else if (minDate) {
    maxTimes = setHours(setMinutes(new Date(), 59), 23);
  }
  return (
    <Container>
      <div className="datepicker-container">
        <label>{label}</label>
      </div>

      {dateAndTime ? (
        <ContainerDatePicker>
          <DatePicker
            selected={date.toDate()}
            onChange={onChangeDate}
            locale={ptBR}
            dateFormat="dd/MM/yyyy h:mm aa"
            timeCaption="Hora"
            timeIntervals={1}
            showTimeSelect
            maxDate={maxDate as Date | null | undefined}
            minDate={minDate as Date | null | undefined}
            minTime={
              minDate
                ? setHours(
                    setMinutes(new Date(), moment(minDate).minutes()),
                    moment(minDate).hours()
                  )
                : setHours(setMinutes(new Date(), 0), 0)
            }
            maxTime={maxTimes ?? undefined}
            readOnly={readOnly}
            customInput={
              <input
                className={classes}
                type="text"
                value={dateFormated}
                ref={inputRef}
                onChange={handleInput}
                readOnly={readOnly}
              />
            }
          />
        </ContainerDatePicker>
      ) : (
        <ContainerDatePicker>
          <DatePicker
            selected={date.toDate()}
            onChange={onChangeDate}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            maxDate={maxDate?.toDate()}
            minDate={minDate?.toDate()}
            readOnly={readOnly}
            // {...rest}
            customInput={
              <input
                className={classes}
                type="text"
                value={dateFormated}
                ref={inputRef}
                onChange={handleInput}
                readOnly={readOnly}
              />
            }
          />
        </ContainerDatePicker>
      )}
    </Container>
  );
}
