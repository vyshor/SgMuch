export default{
  computed: {
    monthlyBreakdown: function () {
      const monthly_breakdown = {};
      for (let entry of this.table_data) {
        let amount = 0;
        switch(entry.frequency) {
          case "daily":
            amount = entry.amount*30;
            break;
          case "weekly":
            amount = entry.amount*4;
            break;
          case "monthly":
            amount = entry.amount;
            break;
          case "yearly":
            amount = Math.floor(entry.amount/12);
            break;
          default:
            amount = entry.amount;
        }
        monthly_breakdown[entry.activity] = amount;
      }
      return monthly_breakdown;
    },
    getChartData: function() {
      const chartData = [["Expenses", "Amount"]];
      for (let item of Object.entries(this.monthlyBreakdown)) {
        chartData.push(item);
      }
      return chartData;
    }
  }
}
