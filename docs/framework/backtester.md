# Backtester Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The Backtester class is responsible for performing backtest runs in WL8, and returning information about those runs. This documentation focuses on the Backtester properties that provide performance information about backtest runs, typically for use in the development of ScoreCard or Performance Visualizer extensions.

## Backtest Result Properties

### BenchmarkBacktestResults
```csharp
public Backtester BenchmarkBacktestResults
```
Returns the Backtester instance for the benchmark comparison backtest run. This property might contain null, in which case it is most likely the benchmark backtest itself that is running.

### CashCurve
```csharp
public TimeSeries CashCurve
```
Returns a TimeSeries instance that represents how much simulated cash was available during the backtest.

### CashInterestEarned
```csharp
public double CashInterestEarned
```
Returns the total simulated cash interest earned during the backtest.

### CommissionsPaid
```csharp
public double CommissionsPaid
```
Returns the total amount of simulated commission paid in the backtest.

### CurrentCash
```csharp
public double CurrentCash
```
Returns the simulated cash available at the end of the backtest.

### CurrentEquity
```csharp
public double CurrentEquity
```
Returns the total equity (capital) at the end of the backtest.

### DailyReturns
```csharp
public TimeSeries DailyReturns
```
Returns a TimeSeries containing the daily percentage returns of backtest equity curve.

### DividendsPaid
```csharp
public double DividendsPaid
```
Returns the amount of simulated dividends collected in the backtest. Dividends are captured from EventDataPoint instances in the BarHistory EventDataPoints property with "dividend" in the instance's Name property.

### DrawdownCurve
```csharp
public TimeSeries DrawdownCurve
```
Returns a TimeSeries instance of the backtest drawdown, which is the largest peak to trough decline of the equity over time.

### DrawdownPctCurve
```csharp
public TimeSeries DrawdownPctCurve
```
Returns a TimeSeries instance of the backtest drawdown percentage.

### EquityCurve
```csharp
public TimeSeries EquityCurve
```
Returns a TimeSeries instance that represents the equity curve of the backtest.

### LiveAccount
```csharp
public BrokerAccount LiveAccount
```
Returns a read-only Live BrokerAccount instance in the Strategy Monitor or Streaming Strategy Window.

**Remarks:**
- LiveAccount is null if the Backtester is not operating with the Live Positions preference
- The Dummy Broker is also considered a live broker account

### LosingPositions
```csharp
public PositionList LosingPositions
```
Returns a PositionList instance containing Position instances for positions with net profit less than zero.

### MarginInterestPaid
```csharp
public double MarginInterestPaid
```
Returns the amount of simulated interest paid for going on margin in the backtest.

### MonthlyNegativeReturns
```csharp
public TimeSeries MonthlyNegativeReturns
```
Returns a TimeSeries containing negative monthly percentage returns used for Sortino Ratio calculation.

### MonthlyReturns
```csharp
public TimeSeries MonthlyReturns
```
Returns a TimeSeries containing monthly percentage returns of backtest equity curve.

### NetProfit
```csharp
public double NetProfit
```
Returns the net profit of the backtest.

### NetProfitPct
```csharp
public double NetProfitPct
```
Returns the percentage net profit of the backtest.

### NSFPositions
```csharp
public PositionList NSFPositions
```
Returns a PositionList instance for positions flagged as NSF (non-sufficient funds).

### OpenPositionCount
```csharp
public int OpenPositionCount
```
Returns the number of currently open positions, excluding NSF positions.

### OpenPositionCountHistory
```csharp
public TimeSeries OpenPositionCountHistory
```
Returns a TimeSeries instance containing number of open positions over time.

### OpenPositions
```csharp
public PositionList OpenPositions
```
Returns a PositionList instance containing open positions including NSF positions.

### Orders
```csharp
public List<Transaction> Orders
```
Returns a List of Transaction instances representing pending orders.

### PositionMetricNames
```csharp
public List<string> PositionMetricNames
```
Returns a list of all available Position Metrics for this backtest run.

### Positions
```csharp
public PositionList Positions
```
Returns a PositionList instance containing all positions taken during the backtest.

### RiskFreeRateOfReturn
```csharp
public double RiskFreeRateOfReturn
```
Returns the average percentage return of 1-year US Treasury yield for the backtest timespan.

### TradeCountHistory
```csharp
public TimeSeries TradeCountHistory
```
Returns a TimeSeries instance containing number of trades over time.

### TransactionLog
```csharp
public List<Transaction> TransactionLog
```
Returns a list of all Transaction instances representing executed trades.

### WinningPositions
```csharp
public PositionList WinningPositions
```
Returns a PositionList instance containing positions with net profit >= 0.

### YearlyReturns
```csharp
public TimeSeries YearlyReturns
```
Returns a TimeSeries containing yearly percentage returns.

## Informational Properties

### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Returns the backtest settings used in the backtest.

### ExecutionMode
```csharp
public StrategyExecutionMode ExecutionMode
```
Returns the context in which the Strategy is being executed:
- Strategy
- Optimization
- StreamingChart
- StrategyMonitor
- Rankings
- Evolver

### PositionSize
```csharp
public PositionSize PositionSize
```
Returns the position sizing method used in the backtest.

### StartingCapital
```csharp
public double StartingCapital
```
Returns the starting capital used for the backtest.

### Strategy
```csharp
public Strategy Strategy
```
Returns the instance of the Strategy class.

### Symbols
```csharp
public List<BarHistory> Symbols
```
Returns a List containing BarHistory instances for backtested symbols.

## Metrics

### Metrics
```csharp
public dynamic Metrics
```
Returns a dynamic class instance containing various performance metrics from available ScoreCards.

## Trading Control

### CancelationCode
```csharp
public int? CancelationCode
```
Used to group exit orders into one logical unit. When one order fills, other open orders with the same code are canceled.

**Note:** CancelationCode is unique by symbol - you can use the same code for different symbols. 