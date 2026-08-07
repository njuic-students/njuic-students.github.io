# 高速接口 SerDes (High-Speed SerDes)

## 概述

SerDes（Serializer/Deserializer，串化解串器）是高速数据通信的核心 IP，负责将并行数据转换为高速串行信号进行传输，并在接收端恢复为并行数据。SerDes 广泛嵌入于 SoC、GPU、网络交换芯片和 FPGA 中，支撑 PCIe、以太网、USB、JESD204 等几乎所有现代高速接口标准。随着 AI/HPC 对 I/O 带宽的指数需求，单个 SerDes 通道速率已突破 224 Gbps（PCIe 7.0 / 800G 以太网级别），是芯片 I/O 性能的关键瓶颈单元。

## 核心原理

SerDes 系统的核心挑战是在**带宽、功耗和信号完整性**之间取得平衡。关键模块包括：

**发送端（TX）**：将低速并行数据（如 64-bit @ 1 GHz）通过 MUX 转换为高速串行比特流（如 1-bit @ 64 Gbps）。输出驱动器需提供精确的阻抗匹配（通常 50Ω）、预加重 / 去加重以补偿信道高频损耗。

**信道（Channel）**：PCB 走线、连接器、背板或电缆。高频信号在信道中受到趋肤效应、介质损耗、阻抗不连续和串扰的影响，产生符号间干扰（ISI），严重时眼图完全闭合。

**接收端（RX）**：CTLE（连续时间线性均衡器）和 DFE（判决反馈均衡器）恢复信号质量；CDR（时钟数据恢复）从数据边沿提取时钟；解串器恢复并行数据。

**PLL / 时钟网络**：低抖动 PLL 生成精确的高速时钟；CDR 跟踪数据和时钟的相位/频率偏差。

## 关键技术

**均衡技术（Equalization）**：TX 端 FFE（前馈均衡器）预加重高频成分；RX 端 CTLE 线性放大高频、DFE 利用先前判决反馈消除尾部 ISI。224 Gbps 速率下常需三级级联 CTLE + 大抽头数 DFE（>30 tap）。

**PAM4 信令**：用 4 电平脉冲幅度调制替代传统 NRZ，每符号传输 2 bit 信息，在相同带宽下速率翻倍。代价是 SNR 损失 ~9.5 dB，需要更复杂的均衡和更强的 FEC。

**ADC-based vs Analog RX**：传统模拟 SerDes RX 用模拟环路做均衡和 CDR；ADC-based RX 在 pad 处直接数字化信号，在数字域做全部均衡和时钟恢复。ADC-based 灵活性高但功耗大，在 224 Gbps 速率下日益成为主流。

**前向纠错（FEC）**：高码率 FEC（如 RS(544,514)、KP4）与 SerDes 协同设计，容忍一定 BER（如 1E-4）后纠正至 1E-15，放松模拟前端 SNR 要求。

**低功耗设计**：快速增长的 I/O 带宽使 SerDes 功耗成为系统瓶颈。时钟转发、无参考 CDR、自适应电压缩放等降低 pJ/bit。

## 代表性工作

| 成果 | 机构 | 主要贡献 |
| --- | --- | --- |
| PCIe 5.0 (32 GT/s) PHY | Synopsys / Cadence | 主流 32 Gbps SerDes IP，消费/数据中心铺量 |
| 112 Gbps PAM4 SerDes | Broadcom / Marvell | 400G/800G 以太网的基石，7nm/5nm 节点 |
| 224 Gbps PAM4 SerDes | Synopsys / Alphawave | PCIe 7.0 级别，3nm，下一代高速互联 |
| 112 Gbps XSR / VSR | TSMC / Cadence | Chiplet D2D 场景的极短距低功耗 SerDes |
| USB4 v2 (80 Gbps) PHY | Intel / AMD | PAM3 调制，消费级 80 Gbps 接口 |

## 应用场景

- **PCIe / CXL 互联**：CPU-GPU、GPU-GPU 间的高速接口
- **数据中心网络**：100G/400G/800G 以太网交换芯片
- **AI 训练互连**：NVIDIA NVLink、Google ICI 等专用互连
- **Chiplet D2D**：UCIe、BoW 标准的 Die-to-Die SerDes
- **存储器接口**：GDDR/HBM PHY、Compute Express Link
- **无线基站**：CPRI/eCPRI 前传接口

## 发展趋势

- **224 Gbps → 448 Gbps**：PAM6/PAM8 或更高阶调制的探索
- **光学 SerDes / CPO**：共封装光学将光引擎直接集成至芯片旁，消除电 SerDes 功耗
- **AI 辅助自适应均衡**：神经网络自适应均衡器和决策器，在恶劣信道中提升 BER 性能
- **硅光子 SerDes**：单片硅光子集成替代长距电 SerDes，能效革命
- **D2D 专用超低功耗 PHY**：Chiplet 场景下 ~0.1 pJ/bit 的 Ultra-Short Reach PHY

