const formatNumber = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  } else {
    return value.toString();
  }
};

export { formatNumber };
