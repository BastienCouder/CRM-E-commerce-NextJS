import React, { useState, ChangeEvent } from "react";

interface DateFilterProps {
  onFilterChange: (monthsBack: number) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [monthsBack, setMonthsBack] = useState<number>(3);

  const handleFilterChange = (): void => {
    onFilterChange(monthsBack);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMonthsBack(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <label htmlFor="monthsBack">Mois en arrière :</label>
      <input
        type="number"
        id="monthsBack"
        name="monthsBack"
        value={monthsBack}
        onChange={handleInputChange}
      />
      <button onClick={handleFilterChange}>Appliquer le filtre</button>
    </div>
  );
};

export default DateFilter;
