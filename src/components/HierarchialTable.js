import React, { useState, useEffect } from "react";
import "./Hierarchial.css";

const initialData = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500,
    children: [
      { id: "phones", label: "Phones", value: 800 },
      { id: "laptops", label: "Laptops", value: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300 },
      { id: "chairs", label: "Chairs", value: 700 },
    ],
  },
];

const BusinessTable = () => {
  const [data, setData] = useState(initialData);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    setGrandTotal(data.reduce((sum, item) => sum + item.value, 0));
  }, [data]);

  const updateValue = (id, newValue) => {
    if (newValue === "" || newValue < 0) return;
    setData(updateRecursive(data, id, parseFloat(newValue)));
  };

  const allocatePercentage = (id, percentage) => {
    setData(updateRecursive(data, id, null, percentage));
  };

  const updateRecursive = (items, id, newValue = null, percentage = null) => {
    return items.map((item) => {
      if (item.id === id) {
        let updatedValue =
          newValue ?? item.value + (item.value * percentage) / 100;
        let variance = ((updatedValue - item.value) / item.value) * 100;
        return {
          ...item,
          value: parseFloat(updatedValue.toFixed(2)),
          variance: parseFloat(variance.toFixed(2)),
        };
      }
      if (item.children) {
        const updatedChildren = updateRecursive(
          item.children,
          id,
          newValue,
          percentage
        );
        const newTotal = updatedChildren.reduce(
          (sum, child) => sum + child.value,
          0
        );
        const variance = ((newTotal - item.value) / item.value) * 100;
        return {
          ...item,
          value: parseFloat(newTotal.toFixed(2)),
          variance: parseFloat(variance.toFixed(2)),
          children: updatedChildren,
        };
      }
      return item;
    });
  };

  return (
    <div className="container">
      <h2>Hierarchical Table</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            
            <th>Input</th>
            <th>Allocation %</th>
            <th>Set Value</th>
            <th>Variance (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>{item.label}</td>
                <td>{item.value.toFixed(2)}</td>
                
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) => updateValue(item.id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => allocatePercentage(item.id, 10)}>
                    +10%
                  </button>
                </td>
                <td>
                  <button onClick={() => updateValue(item.id, item.value)}>
                    Set
                  </button>
                </td>
                <td>{item.variance ? item.variance.toFixed(2) + "%" : "-"}</td> 
              </tr>
              {item.children &&
                item.children.map((child) => (
                  <tr key={child.id}>
                    <td>-- {child.label}</td>
                    <td>{child.value.toFixed(2)}</td>
                    
                    <td>
                      <input
                        type="number"
                        min="0"
                        onChange={(e) => updateValue(child.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => allocatePercentage(child.id, 10)}>
                        +10%
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => updateValue(child.id, child.value)}
                      >
                        Set
                      </button>
                    </td>
                    <td>
                      {child.variance ? child.variance.toFixed(2) + "%" : "-"}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td>
              <strong>{grandTotal.toFixed(2)}</strong>
            </td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default BusinessTable;
