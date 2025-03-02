# BacktestSettings Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The BacktestSettings class contains information about how a backtest was conducted, including the benchmark symbol used, and whether cash interest and dividends were considered.

## Members

### CashInterestRate
```csharp
public double CashInterestRate
```
The percentage amount of interest that simulated cash in the backtest should generate.

### CollectDividends
```csharp
public bool CollectDividends
```
If set to true, simulated dividends will be collected during the backtest. Dividends are calculated based on EventDataPoint instances in the BarHistory instances being tested, and data points with the Name "dividend" are considered.

### CommissionAmount
```csharp
public double CommissionAmount
```
Specifies the amount to use for backtest simulated commissions. Works in conjunction with the CommissionType property.

### CommissionType
```csharp
public CommissionTypes CommissionType
```
Specifies the commission type used in the backtest. Possible values are:
- None
- Flat - CommissionAmount specifies total commission per trade
- PerShare - CommissionAmount specifies commission per share/contract traded

### FuturesMode
```csharp
public bool FuturesMode
```
If set to true, the backtest will be run in "futures mode", and take account of each symbol's Margin, PointValue, and Tick values when calculating gains and losses.

### IsLimitSlippageEnabled
```csharp
public bool IsLimitSlippageEnabled
```
Allows you to read or override the Backtest Preference that enables Limit Order Slippage. Works in conjunction with SlippagePercentStocks and SlippageTickFutures properties.

### IsSlippageEnabled
```csharp
public bool IsSlippageEnabled
```
Allows you to read or override the Backtest Preference Adjust Entry/Exit Prices that enables Slippage for Market, Stop, and AtClose orders. Works in conjunction with SlippagePercentStocks and SlippageTickFutures properties.

### MarginInterestRate
```csharp
public double MarginInterestRate
```
The percentage amount that simulated margin interest should be charged during the backtest.

### RetainNSFPositions
```csharp
public bool RetainNSFPositions
```
This setting overrides the Backtest Preference: Retain NSF Positions.

If set to true, the Backtester will internally retain and continue to process positions for which there was insufficient capital to complete the simulated fill. This preserves the internal integrity of a Strategy, preventing it from potentially signaling new buy orders as an NSF position continues to be held until its eventual exit conditions are met.

### RoundLots
```csharp
public bool RoundLots
```
If set to true, Transaction Quantity will be rounded to the nearest 100 shares/contracts, or the nearest 10 if under 100.

### SlippagePercentStocks
```csharp
public double SlippagePercentStocks
```
Allows you to read or override the Backtest Preference SlippagePercentStocks that sets the Slippage percentage amount for Market, Stop, and AtClose orders. Works in conjunction with IsSlippageEnabled and IsLimitSlippageEnabled properties.

### SlippageTickFutures
```csharp
public int SlippageTickFutures
```
Allows you to read or override the Backtest Preference SlippagePercentStocks that sets the amount of Slippage in ticks for futures contracts for Market, Stop, and AtClose orders. Works in conjunction with IsSlippageEnabled and IsLimitSlippageEnabled properties.

### UseMarginInBenchmark
```csharp
public bool UseMarginInBenchmark
```
By default, the comparison benchmark buy and hold backtest does not employ margin. Set this to true to have it employ the same Margin value in the backtest's PositionSize property.

### UseUSTRateAsInterest
```csharp
public bool UseUSTRateAsInterest
```
If set to true, the CashInterest property will be ignored, and the percentage rate for simulated interest on cash will be determined by the yield of the US Treasury. The US Treasury period to use for this purpose is set in the YieldPeriod property.

### VolumeLimit
```csharp
public double VolumeLimit
```
If greater than zero, will limit the Quantity of a Transaction to that percentage of the entry bar's volume.

### YieldPeriod
```csharp
public YieldPeriods YieldPeriod
```
The period of US Treasury yield to use when UseUSTRateAsInterest is set to true. Possible values are:
- OneMonth
- ThreeMonth
- SixMonth
- OneYear
- TwoYear
- ThreeYear
- FiveYear
- SevenYear
- TenYear
- TwentyYear
- ThirtyYear 