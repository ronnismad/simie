/** Simplified Chinese UI; SI symbols and export field names remain stable. */
export const zh = new Map([
  [
    "Rejected candidate · diagnosis only",
    "已拒绝的候选方案 · 仅供诊断"
  ],
  [
    "Candidate geometry · review physical checks",
    "候选方案几何结构 · 请检查物理条件"
  ],
  [
    "Placement preview",
    "位置预览"
  ],
  [
    "Geometry of this candidate. Front/back placement and transport thickness come from the fixed device context; the inverse network proposes particle geometry.",
    "此候选方案的几何结构。前/后侧位置及传输层厚度来自固定器件条件；逆向网络仅提出粒子几何参数。"
  ],
  [
    "ETL: electron-transport layer. HTL: hole-transport layer. Blue: shell on the exposed cap. Layer drawing is schematic.",
    "ETL：电子传输层。HTL：空穴传输层。蓝色：暴露球冠上的壳层。各层为示意图。"
  ],
  [
    "Inspect placement in explorer →",
    "在探索器中查看位置 →"
  ],
  [
    "Quick start guide",
    "快速入门"
  ],
  [
    "Affiliations",
    "作者单位"
  ],
  [
    "Inputs changed · estimate required",
    "输入已更改 · 需要重新估算"
  ],
  [
    "All design inputs",
    "全部设计输入"
  ],
  [
    "✕ Failed physical checks",
    "✕ 未通过物理检查"
  ],
  [
    "! Limits to review",
    "! 需要审查适用范围"
  ],
  [
    "✓ Necessary checks passed",
    "✓ 已通过必要检查"
  ],
  [
    "Physics gate",
    "物理检查关卡"
  ],
  [
    "Response",
    "响应"
  ],
  [
    "Geometry",
    "几何结构"
  ],
  [
    "Network",
    "神经网络"
  ],
  [
    "Workspace views",
    "工作区视图"
  ],
  [
    "PNG",
    "PNG"
  ],
  [
    "CSV",
    "CSV"
  ],
  [
    "Review required",
    "需要审查"
  ],
  [
    "Pass",
    "通过"
  ],
  [
    "Fail",
    "未通过"
  ],
  [
    "Estimate the design before exporting.",
    "导出前请先估算设计。"
  ],
  [
    "Image export failed.",
    "图像导出失败。"
  ],
  [
    "View Physics gate ↓",
    "查看物理检查关卡 ↓"
  ],
  [
    "Fit whole diagram",
    "显示完整示意图"
  ],
  [
    "Readable detail",
    "清晰细节"
  ],
  [
    "Export diagram (SVG)",
    "导出示意图（SVG）"
  ],
  [
    "Estimate this design",
    "估算此设计"
  ],
  [
    "Geometry changed. Estimate to update the numerical results.",
    "几何参数已更改。请点击“估算”以更新数值结果。"
  ],
  [
    "Numerical results match the current inputs.",
    "数值结果与当前输入一致。"
  ],
  [
    "Schematic view; absorber and other layers are not to a common scale.",
    "此图仅为示意；吸收层与其他层未采用统一比例。"
  ],
  [
    "Back placement: illustrative mapping; no separate back-side calibration.",
    "后侧位置：示意映射；没有单独的后侧校准。"
  ],
  [
    "Displayed geometry",
    "当前显示的几何结构"
  ],
  [
    "Live estimate is updating…",
    "正在自动估算…"
  ],
  [
    "Use valid inputs before estimating or exporting.",
    "请先输入有效参数，再进行估算或导出。"
  ],
  [
    "Geometry controls",
    "几何参数"
  ],
  [
    "Diameter d (nm)",
    "直径 d（nm）"
  ],
  [
    "Model transport thickness t (nm)",
    "模型传输层厚度 t（nm）"
  ],
  [
    "Exposed-cap shell coverage (%)",
    "暴露球冠壳层覆盖率（%）"
  ],
  [
    "Placement",
    "位置"
  ],
  [
    "Enlarge diagram",
    "放大示意图"
  ],
  [
    "Standard view",
    "标准视图"
  ],
  [
    "Scroll horizontally to inspect the enlarged diagram.",
    "水平滚动以查看放大的示意图。"
  ],
  [
    "ETL: electron-transport layer. HTL: hole-transport layer. d: particle diameter. t: model transport-layer thickness. h: exposed cap height.",
    "ETL：电子传输层。HTL：空穴传输层。d：粒子直径。t：模型传输层厚度。h：暴露球冠高度。"
  ],
  [
    "The absorber is drawn at a fixed schematic height; it is not to scale with d or t. Its thickness is set separately in the device inputs.",
    "吸收层采用固定示意高度，与 d 或 t 不成比例。其实际厚度在器件输入中单独设置。"
  ],
  [
    "Back-side view mirrors the particle geometry onto the HTL as in Figure S2. Here t is the model transport-thickness input, used illustratively; it is not an independently specified or calibrated HTL thickness. Changing side does not change the calculated response.",
    "后侧视图将粒子几何结构镜像到 HTL 处，如补充图 S2。此处 t 是模型传输层厚度输入，仅用于示意；它不是独立设定或校准的 HTL 厚度。切换前后侧不会改变计算响应。"
  ],
  [
    "Live placement schematic",
    "动态位置示意图"
  ],
  [
    "Reference: Supplement Figure S2",
    "来源：补充材料图 S2"
  ],
  [
    "Particle cross-section for the current inputs",
    "当前输入对应的粒子截面"
  ],
  [
    "Perovskite",
    "钙钛矿"
  ],
  [
    "Light",
    "入射光"
  ],
  [
    "Glass / transparent contact",
    "玻璃 / 透明电极"
  ],
  [
    "Enter valid diameter, transport thickness and shell coverage to display the geometry.",
    "请输入有效的直径、传输层厚度和壳层覆盖率以显示几何结构。"
  ],
  [
    "Geometry updates immediately, even when automatic estimation is off. One representative particle is shown; lateral spacing and size dispersion are not drawn.",
    "即使关闭自动估算，几何结构也会即时更新。图中仅显示一个代表性粒子，不显示横向间距或尺寸分散性。"
  ],
  [
    "Blue marks shell coverage on the exposed cap. Its arrangement is illustrative; the model uses the covered area fraction. Layer thickness t uses the transport-thickness input. Other layers are schematic.",
    "蓝色表示暴露球冠上的壳层覆盖。其分布仅为示意；模型采用覆盖面积比例。层厚 t 使用模型传输层厚度输入，其他层仅为示意。"
  ],
  [
    "Back-side geometry is illustrative: the model has no separate side dependence or back-side calibration.",
    "后侧几何结构仅为示意：模型没有单独的前后侧响应或后侧校准。"
  ],
  [
    "No exposed cap: the particle is fully within the transport layer.",
    "无暴露球冠：粒子完全位于传输层内。"
  ],
  [
    "Exposed cap height",
    "暴露球冠高度"
  ],
  [
    "Front placement",
    "前侧位置"
  ],
  [
    "Back placement",
    "后侧位置"
  ],
  [
    "Particle placement and spacing",
    "粒子位置与间距"
  ],
  [
    "View particle placement ↓",
    "查看粒子位置 ↓"
  ],
  [
    "Supplement Figure S2 · device geometry",
    "补充图 S2 · 器件几何结构"
  ],
  [
    "Open full-size figure ↗",
    "打开原尺寸图片 ↗"
  ],
  [
    "Original figure from the Supplement; schematic, not to scale. This is a geometry guide, not a live rendering of the selected inputs.",
    "补充材料原图，仅为示意，并非按比例绘制。此图提供几何说明，不随当前输入动态变化。"
  ],
  [
    "(a) Front planar: particles at the electron-transport layer (ETL), on the incident-light side of the absorber.",
    "(a) 前侧平面结构：粒子位于吸收层入射光一侧的电子传输层（ETL）处。"
  ],
  [
    "(b) Back planar: particles at the hole-transport layer (HTL), on the opposite side. Back-side placement is schematic and is not separately calibrated in the model.",
    "(b) 后侧平面结构：粒子位于另一侧的空穴传输层（HTL）处。后侧位置仅为示意，模型未进行单独校准。"
  ],
  [
    "(c) Front mesoporous: the thicker transport layer changes the exposed particle cap. The blue arc shows partial coverage by a transport-layer shell.",
    "(c) 前侧介孔结构：较厚的传输层改变粒子的暴露球冠。蓝色弧线表示传输层壳层的部分覆盖。"
  ],
  [
    "(d) Areal density: P = nA⁻¹ᐟ². This is the centre-to-centre pitch for a square array and an effective density-based spacing for disorder.",
    "(d) 面密度：P = nA⁻¹ᐟ²。对方形阵列，它是中心间距；对于无序分布，它是基于密度的有效间距。"
  ],
  [
    "Light indicates the illumination direction; h is the exposed cap height, h = max(0, d − tETL). Perovskite is the absorber; glass / transparent contact is the supporting transparent electrode.",
    "入射光箭头表示光照方向；h 为暴露球冠高度，h = max(0, d − tETL)。钙钛矿为吸收层；玻璃 / 透明电极为透明支撑电极。"
  ],
  [
    "Mean diameter of the silicon particles.",
    "硅粒子的平均直径。"
  ],
  [
    "Standard deviation divided by mean diameter; 0 means a single size.",
    "标准差除以平均直径；0 表示单一尺寸。"
  ],
  [
    "Density-based spacing P = nA⁻¹ᐟ², where nA is the number of particles per unit area. It equals centre-to-centre pitch for a square array; for disorder it is an effective spacing.",
    "基于面密度的间距 P = nA⁻¹ᐟ²，nA 为单位面积粒子数。对方形阵列为中心间距，对无序分布为有效间距。"
  ],
  [
    "Fraction of the exposed cap covered by a transport-layer shell: 0 is uncovered, 1 is fully covered.",
    "被传输层壳层覆盖的暴露球冠比例：0 为无覆盖，1 为完全覆盖。"
  ],
  [
    "Bandgap of the perovskite absorber.",
    "钙钛矿吸收层的带隙。"
  ],
  [
    "Thickness of the light-absorbing perovskite layer.",
    "吸光钙钛矿层的厚度。"
  ],
  [
    "Sets the device architecture: planar up to 120 nm, mesoporous above 120 nm.",
    "决定器件结构：厚度不超过 120 nm 为平面结构，大于 120 nm 为介孔结构。"
  ],
  [
    "1. Set parameters",
    "1. 设置参数"
  ],
  [
    "Start with the reference geometry or a calibration condition, then adjust the inputs.",
    "从参考几何结构或某一校准条件开始，然后调整输入。"
  ],
  [
    "2. Estimate",
    "2. 估算"
  ],
  [
    "Live update recalculates automatically. Turn it off to edit several inputs before pressing Estimate.",
    "自动更新会立即重新计算。若要先修改多个参数，请关闭自动更新，再点击“估算”。"
  ],
  [
    "3. Read the results",
    "3. 解读结果"
  ],
  [
    "Read the relative changes and scientific checks together before interpreting a design.",
    "解释设计结果前，请同时查看相对变化和物理检查。"
  ],
  [
    "Estimate and view results →",
    "估算并查看结果 →"
  ],
  [
    "How to read these results",
    "如何解读结果"
  ],
  [
    "Positive values indicate an increase; negative values indicate a decrease relative to the model baseline. For example, +5% means 1.05 times the baseline, not five percentage points.",
    "正值表示相对模型基准增加，负值表示减少。例如 +5% 表示基准的 1.05 倍，并非增加五个百分点。"
  ],
  [
    "The ± value is the standard deviation across five calibration members, not a confidence interval.",
    "± 数值为五个校准成员之间的标准差，不是置信区间。"
  ],
  [
    "Failed physical checks. These results are diagnostic only; this design is not recommended for an experiment.",
    "未通过物理检查。结果仅供诊断，不建议将此设计用于实验。"
  ],
  [
    "Review the scientific checks below. Passing necessary checks does not establish experimental feasibility.",
    "请查看下方的物理检查。通过必要检查并不代表实验可行性已得到验证。"
  ],
  [
    "View scientific checks ↓",
    "查看物理检查 ↓"
  ],
  [
    "Harbin Engineering University",
    "哈尔滨工程大学"
  ],
  [
    "Paper and authors",
    "论文与作者"
  ],
  [
    "ITMO University",
    "ITMO 大学"
  ],
  [
    "School of Physics and Engineering, ITMO University, St. Petersburg, Russia",
    "俄罗斯圣彼得堡 ITMO 大学物理与工程学院"
  ],
  [
    "Qingdao Innovation and Development Center, Harbin Engineering University, Qingdao, China",
    "中国青岛哈尔滨工程大学青岛创新发展基地"
  ],
  [
    "The verified model release is not available yet.",
    "已验证的模型版本尚不可用。"
  ],
  [
    "Model asset integrity check failed. Reload the page or review the deployment.",
    "模型资源完整性检查失败。请重新加载页面或检查部署。"
  ],
  [
    "Network calibration does not match the physical model.",
    "网络校准与物理模型不一致。"
  ],
  [
    "Ensemble mean · direct equations",
    "集成均值 · 方程直接计算"
  ],
  [
    "Holdout metrics quantify surrogate agreement with the physical model. The displayed ensemble metrics correspond to the revised Supplement. The nominal demonstration and direct inverse residuals are included in the verification report; finite-grid qualifications are given in Supplement S2, and inverse checks in S8.",
    "留出集指标量化代理模型与物理模型的一致性。所示集成指标对应修订后的补充材料。验证报告包含标称演示和直接逆向残差；有限网格说明见 S2，逆向检查见 S8。"
  ],
  [
    "Mean absolute errors J, V, FF (percentage points)",
    "J、V、FF 的平均绝对误差（百分点）"
  ],
  [
    "Undefined (constant target)",
    "未定义（目标为常数）"
  ],
  [
    "G̃ and Π̃ are normalised at the reference geometry. Electrical cost depends on the exposed cap, shell coverage and doping. Device responses use the paper’s local linearised approximation.",
    "G̃ 和 Π̃ 按参考几何结构归一化。电学代价取决于暴露球冠、壳层覆盖率和掺杂。器件响应采用论文的局部线性化近似。"
  ],
  [
    "The direct physics and new calibration are ready. Fresh network weights are not yet packaged; inverse and experiment selection are disabled.",
    "直接物理模型和新校准已就绪。新的网络权重尚未打包；逆向设计和实验选择已禁用。"
  ],
  [
    "SiMie design lab home",
    "SiMie 设计工作区主页"
  ],
  [
    "Workspace navigation",
    "工作区导航"
  ],
  [
    "− 1.59 eV.",
    "− 1.59 eV。"
  ],
  [
    "(nm)",
    "(nm)"
  ],
  [
    "Inputs changed. Press Estimate to refresh these results.",
    "输入已更改。请点击“估算”刷新结果。"
  ],
  [
    "Silicon nanoparticle design",
    "硅纳米粒子设计"
  ],
  [
    "Eight input forward network with three hidden layers of 64 tanh units and three outputs",
    "八输入前向网络，含三个各 64 个 tanh 单元的隐藏层和三个输出"
  ],
  [
    "and",
    "和"
  ],
  [
    "Fresh network weights are not yet packaged; inverse and experiment selection are disabled.",
    "新的网络权重尚未打包；逆向设计和实验选择已禁用。"
  ],
  [
    "Skip to workspace",
    "跳转到工作区"
  ],
  [
    "Mie-resonant silicon nanoparticle design for perovskite solar cells.",
    "面向钙钛矿太阳能电池的米氏共振硅纳米粒子设计。"
  ],
  [
    "Interface language",
    "界面语言"
  ],
  [
    "English",
    "English"
  ],
  [
    "Dark mode",
    "深色模式"
  ],
  [
    "Light mode",
    "浅色模式"
  ],
  [
    "Toggle dark mode",
    "切换深色模式"
  ],
  [
    "Loading scientific model…",
    "正在加载科学模型…"
  ],
  [
    "Calculated in your browser",
    "在浏览器中计算"
  ],
  [
    "Model unavailable",
    "模型不可用"
  ],
  [
    "WORKSPACE",
    "工作区"
  ],
  [
    "Design explorer",
    "设计探索器"
  ],
  [
    "Inverse design",
    "逆向设计"
  ],
  [
    "Next experiment",
    "下一步实验"
  ],
  [
    "Methods & data",
    "方法与数据"
  ],
  [
    "THE MODEL",
    "模型"
  ],
  [
    "Mie optics.",
    "米氏光学。"
  ],
  [
    "Calibrated responses.",
    "经校准的响应。"
  ],
  [
    "Visible assumptions.",
    "明确显示的假设。"
  ],
  [
    "Read the implementation notes",
    "阅读实现说明"
  ],
  [
    "Paper implementation · 2.0",
    "论文计算实现 · 2.0"
  ],
  [
    "All calculations stay in your browser.",
    "所有计算均在您的浏览器中完成。"
  ],
  [
    "Calibration uncertainties are provisional. Shared pixel scatter and sample counts are disclosed in Methods & data.",
    "校准不确定性为暂定值。共用的像素离散度及样本量见“方法与数据”。"
  ],
  [
    "View data ↗",
    "查看数据 ↗"
  ],
  [
    "FORWARD MODEL / MAIN TEXT & SUPPLEMENT",
    "前向模型 / 正文与补充材料"
  ],
  [
    "Explore the design space.",
    "探索设计空间。"
  ],
  [
    "Connect particle geometry to the paper’s optical and device-response equations.",
    "将粒子几何参数与论文的光学及器件响应方程关联。"
  ],
  [
    "↓ Export result",
    "↓ 导出结果"
  ],
  [
    "Design parameters",
    "设计参数"
  ],
  [
    "Reset",
    "重置"
  ],
  [
    "Load a calibration condition",
    "加载校准条件"
  ],
  [
    "Reference geometry · 160 nm",
    "参考几何结构 · 160 nm"
  ],
  [
    "Planar · fraction M",
    "平面结构 · M 组分"
  ],
  [
    "Planar · fraction L",
    "平面结构 · L 组分"
  ],
  [
    "Mesoporous · 1:180",
    "介孔结构 · 1:180"
  ],
  [
    "Mesoporous · 1:120",
    "介孔结构 · 1:120"
  ],
  [
    "Mesoporous · 1:60",
    "介孔结构 · 1:60"
  ],
  [
    "Mesoporous · 1:30",
    "介孔结构 · 1:30"
  ],
  [
    "Custom design",
    "自定义设计"
  ],
  [
    "PARTICLE ARRAY",
    "粒子阵列"
  ],
  [
    "DEVICE CONTEXT",
    "器件条件"
  ],
  [
    "Mean diameter",
    "平均直径"
  ],
  [
    "Relative dispersion",
    "相对分散度"
  ],
  [
    "Mean spacing",
    "平均间距"
  ],
  [
    "Shell coverage",
    "壳层覆盖率"
  ],
  [
    "Absorber bandgap",
    "吸收层带隙"
  ],
  [
    "Absorber thickness",
    "吸收层厚度"
  ],
  [
    "Transport-layer thickness",
    "传输层厚度"
  ],
  [
    "fraction",
    "比例"
  ],
  [
    "nm",
    "nm"
  ],
  [
    "eV",
    "eV"
  ],
  [
    "Particle side",
    "粒子所在侧"
  ],
  [
    "Front",
    "前侧"
  ],
  [
    "Back · not separately calibrated",
    "后侧 · 未单独校准"
  ],
  [
    "Silicon doping",
    "硅掺杂"
  ],
  [
    "Intrinsic",
    "本征"
  ],
  [
    "p-type",
    "p 型"
  ],
  [
    "Architecture from transport thickness",
    "由传输层厚度确定结构"
  ],
  [
    "Planar",
    "平面结构"
  ],
  [
    "Mesoporous",
    "介孔结构"
  ],
  [
    "Live update",
    "自动更新"
  ],
  [
    "Inputs update the estimate",
    "输入会更新估算"
  ],
  [
    "Estimate on click",
    "点击后估算"
  ],
  [
    "Press Estimate to update",
    "点击“估算”以更新"
  ],
  [
    "Estimate",
    "估算"
  ],
  [
    "Ranges follow Table 1. Architecture changes above 120 nm transport-layer thickness.",
    "范围遵循表 1。传输层厚度大于 120 nm 时切换为介孔结构。"
  ],
  [
    "PREDICTED RELATIVE RESPONSE",
    "预测相对响应"
  ],
  [
    "Five-member mean · direct equations",
    "五成员均值 · 方程直接计算"
  ],
  [
    "Short-circuit current",
    "短路电流"
  ],
  [
    "Open-circuit voltage",
    "开路电压"
  ],
  [
    "Fill factor",
    "填充因子"
  ],
  [
    "Loading model…",
    "正在加载模型…"
  ],
  [
    "Diameter response",
    "直径响应曲线"
  ],
  [
    "Current context and dispersion held fixed",
    "固定当前器件条件和分散度"
  ],
  [
    "Chart quantity",
    "曲线物理量"
  ],
  [
    "Linearised efficiency gain",
    "线性化效率增益"
  ],
  [
    "Optical descriptor S̄",
    "光学描述量 S̄"
  ],
  [
    "Current gain",
    "电流增益"
  ],
  [
    "Direct-equation mean",
    "方程直接计算均值"
  ],
  [
    "±1 ensemble SD",
    "±1 集成标准差"
  ],
  [
    "Current design",
    "当前设计"
  ],
  [
    "The shaded spread measures bootstrap calibration variation; it does not include experimental or model-form uncertainty.",
    "阴影范围表示自助法校准的变化，不包含实验或模型形式的不确定性。"
  ],
  [
    "Inside the forward network",
    "前向网络内部"
  ],
  [
    "Live activations · newly trained ensemble",
    "动态激活值 · 重新训练的集成"
  ],
  [
    "Member",
    "成员"
  ],
  [
    "Network ensemble member",
    "网络集成成员"
  ],
  [
    "Forward network diagram",
    "前向网络示意图"
  ],
  [
    "Loading the trained network activations…",
    "正在加载已训练网络的激活值…"
  ],
  [
    "Hidden tanh activation",
    "隐藏层 tanh 激活值"
  ],
  [
    "Input labels show physical values. P and tETL are logarithmically encoded before standardisation, as specified in Supplement S5. All 64 units per hidden layer are shown. Connections are sampled by weight magnitude for readability. Colours show actual activations; outputs are surrogate predictions, not the direct-model values above.",
    "输入标签显示物理值。P 和 tETL 在标准化前进行对数编码，见补充材料 S5。显示每个隐藏层的全部 64 个单元。为便于阅读，连接按权重大小采样。颜色表示实际激活值；输出为代理预测，不是上方的直接模型值。"
  ],
  [
    "Scientific checks",
    "物理检查"
  ],
  [
    "Pending",
    "待检查"
  ],
  [
    "Checking the paper’s response against its inputs and calibration range.",
    "对照输入和校准范围检查论文响应。"
  ],
  [
    "Inspect calculated quantities",
    "查看计算量"
  ],
  [
    "Relative changes are percentages, not absolute percentage points.",
    "相对变化以百分比表示，不是绝对百分点。"
  ],
  [
    "Copy design link ↗",
    "复制设计链接 ↗"
  ],
  [
    "Methods & provenance ↗",
    "方法与来源 ↗"
  ],
  [
    "SiMie · A scientific model, with its assumptions visible.",
    "SiMie · 明确展示假设的科学模型。"
  ],
  [
    "TANDEM NETWORK / FROZEN FORWARD SURROGATE",
    "串联网络 / 冻结的前向代理模型"
  ],
  [
    "Start with a target.",
    "从目标响应开始。"
  ],
  [
    "Request a response. Inspect five candidate geometries against the direct physical model.",
    "输入目标响应，再使用直接物理模型检查五个候选几何方案。"
  ],
  [
    "The inverse network proposes diameter, dispersion, spacing and shell coverage. Device context is taken from the Design explorer. A target may be unreachable; proposals are verified, never presented as guaranteed solutions.",
    "逆向网络提出直径、分散度、间距和壳层覆盖率。器件条件来自设计探索器。目标可能不可达；候选方案需要检查，不保证实现目标。"
  ],
  [
    "Edit context →",
    "编辑器件条件 →"
  ],
  [
    "Target ΔJ",
    "目标 ΔJ"
  ],
  [
    "Target ΔV",
    "目标 ΔV"
  ],
  [
    "Target ΔFF/FF (%)",
    "目标 ΔFF/FF（%）"
  ],
  [
    "Propose designs →",
    "提出设计方案 →"
  ],
  [
    "A target can have several solutions.",
    "同一目标可以有多个解。"
  ],
  [
    "Run the tandem ensemble to compare five bounded proposals, target errors and scientific checks.",
    "运行串联集成，比较五个有界候选方案、目标误差及物理检查。"
  ],
  [
    "CALIBRATION ENSEMBLE / RISK & INFORMATION",
    "校准集成 / 风险与信息"
  ],
  [
    "Choose the next experiment.",
    "选择下一步实验。"
  ],
  [
    "Compare risk-adjusted gain and uncertainty within an exploratory candidate set.",
    "在探索性候选集合中比较风险调整增益和不确定性。"
  ],
  [
    "Exploratory mode: 512 reproducible candidates are sampled within Table 1 at the current context and ranked by the trained ensemble. Both candidates are checked with the direct equations. Failed candidates are shown for diagnosis, not recommended for experiments. The Supplement’s fixed-context acquisition benchmark is provided separately in the verification report.",
    "探索模式：在当前器件条件下，按表 1 范围生成 512 个可复现候选方案，并由已训练集成排序。两个选中候选方案均用直接方程检查。未通过者仅供诊断，不作为实验建议。补充材料中的固定条件采集基准另见验证报告。"
  ],
  [
    "Risk parameter κ",
    "风险参数 κ"
  ],
  [
    "Robust proposal",
    "稳健候选方案"
  ],
  [
    "Compare candidates →",
    "比较候选方案 →"
  ],
  [
    "Explore gain and disagreement.",
    "探索增益与模型分歧。"
  ],
  [
    "The search is over a finite candidate set. A numerical optimum is not an experimentally validated device.",
    "搜索仅限有限候选集合。数值最优解不等同于已获实验验证的器件。"
  ],
  [
    "TRANSPARENCY / REPRODUCIBILITY",
    "透明性 / 可复现性"
  ],
  [
    "The equations, made inspectable.",
    "可检查的方程。"
  ],
  [
    "Computational companion to the revised manuscript and its Supplementary Information.",
    "修订论文及补充材料的计算配套工具。"
  ],
  [
    "Source repository ↗",
    "源代码仓库 ↗"
  ],
  [
    "01 / OPTICS",
    "01 / 光学"
  ],
  [
    "Useful forward scattering",
    "有效前向散射"
  ],
  [
    "02 / DEVICE RESPONSE",
    "02 / 器件响应"
  ],
  [
    "Normalised gain and exposed cap",
    "归一化增益与暴露球冠"
  ],
  [
    "Wavelength-dependent Green silicon and Phillips MAPbI₃ constants; real host index. ASTM G173 global-tilt irradiance is converted to photon flux exactly once. The absorber’s absorption edge is shifted by E",
    "采用随波长变化的 Green 硅和 Phillips MAPbI₃ 光学常数，以及实部宿主折射率。ASTM G173 全球倾斜面辐照度仅转换一次为光子通量。吸收边按 E 平移"
  ],
  [
    "are normalised at the reference geometry. Only the exposed cap contributes electrical cost. No extra loss term, current saturation or adjustment to recover reported figure values is introduced.",
    "按参考几何结构归一化。只有暴露球冠产生电学代价。未额外引入损耗项、电流饱和或为恢复图示结果而作的调整。"
  ],
  [
    "Calibration anchors · Supplementary Table S1",
    "校准点 · 补充表 S1"
  ],
  [
    "Changes are relative to the reference device of each experimental batch. Mesoporous absorber thickness (500 nm), particle diameter and dispersion are assumed in the supplement.",
    "变化相对于各实验批次的参考器件。介孔吸收层厚度（500 nm）、粒子直径及分散度在补充材料中为假设值。"
  ],
  [
    "Condition",
    "条件"
  ],
  [
    "Full-data calibration",
    "全数据校准"
  ],
  [
    "Unidentified",
    "不可辨识"
  ],
  [
    "Provisional pixel SD: 2.0%, 1.0%, 2.6% for J, V, FF respectively; assumed n = 20 per condition. Standard error = SD/√n. Architecture-stratified nonnegative weighted least squares; 200 bootstrap resamples per architecture; five trained member pairs.",
    "J、V、FF 的暂定像素标准差分别为 2.0%、1.0%、2.6%；假设每个条件 n = 20。标准误差 = SD/√n。按结构分层进行非负加权最小二乘；每种结构 200 次自助重采样；训练五对成员网络。"
  ],
  [
    "Methods and scope",
    "方法与适用范围"
  ],
  [
    "Spectral units and collection",
    "光谱单位与收集"
  ],
  [
    "Numerical prescription",
    "数值计算规范"
  ],
  [
    "Eight network inputs",
    "八个网络输入"
  ],
  [
    "Response range",
    "响应范围"
  ],
  [
    "What uncertainty means",
    "不确定性的含义"
  ],
  [
    "Reported optima",
    "报告的最优值"
  ],
  [
    "The spectral weight is the uncollected photon flux: w = φ[1 − η(1 − exp(−αt))], with η = 0.826. ASTM irradiance is converted to photon flux once. The same collection factor is used for the baseline-current diagnostic.",
    "光谱权重是未收集的光子通量：w = φ[1 − η(1 − exp(−αt))]，η = 0.826。ASTM 辐照度仅转换一次为光子通量。基准电流检查采用相同收集因子。"
  ],
  [
    "The supplement’s exact grids are used: wavelengths 320–900 nm every 2 nm; diameters 50–300 nm every 2 nm. The lognormal average uses its stated trapezoid rule, without renormalising truncated tails. σ/d = 0 is evaluated as the monodisperse limit. Under-resolved distributions are explicitly flagged.",
    "严格使用补充材料网格：波长 320–900 nm，步长 2 nm；直径 50–300 nm，步长 2 nm。对数正态平均采用规定的梯形法，不对截断尾部重新归一化。σ/d = 0 采用单分散极限。分布未充分分辨时会明确提示。"
  ],
  [
    "The forward network uses eight optical and device inputs. Placement side is retained as a design annotation because no separate back-side kernel is specified. The inverse network takes three targets and four context inputs; doping is encoded as 1 or 0.85.",
    "前向网络使用八个光学与器件输入。由于未指定独立后侧光学核，前后侧仅作为设计注释。逆向网络使用三个目标与四个器件条件输入；掺杂编码为 1 或 0.85。"
  ],
  [
    "The linearised response is evaluated within its stated scope. The diagnostic compares the predicted current, using η = 0.826, with the unity-collection ceiling on the spectral grid. Extrapolated proposals retain these checks; outputs are not clipped or reranked.",
    "线性化响应在其适用范围内计算。检查使用 η = 0.826 的预测电流与光谱网格上的单位收集效率上限比较。外推方案同样接受检查；输出不截断，也不重新排序。"
  ],
  [
    "The five-member standard deviation uses the 1/B convention. It measures sensitivity to resampled calibration rows, conditional on the model and provisional errors. It does not bound shared model error. Mesoporous γ and δ are unidentified by the anchors; zero solver values are conventions.",
    "五成员标准差采用 1/B 约定，衡量给定模型及暂定误差下对校准行重采样的敏感性，不能限定共同模型误差。介孔 γ 和 δ 无法由校准点辨识；求解器取零是一种约定。"
  ],
  [
    "The monodisperse optical sweep reproduces a maximum at 184 nm. At relative dispersion 0.1 and coupling parameters 0, 0.3, 1 and 3, the reference objective selects 186, 140, 104 and 68 nm, respectively. These benchmarks hold the reference absorber and device context fixed.",
    "单分散光学扫描在 184 nm 处取得最大值。在相对分散度 0.1 及耦合参数 0、0.3、1、3 下，参考目标分别选择 186、140、104、68 nm。这些基准固定参考吸收层和器件条件。"
  ],
  [
    "Fresh training and reproducibility",
    "重新训练与可复现性"
  ],
  [
    "Loading training provenance…",
    "正在加载训练来源…"
  ],
  [
    "The forward model has three 64-unit tanh hidden layers. The bounded inverse has two 64-unit tanh hidden layers and learns through the frozen forward network, with the stated dispersion penalty. Adam settings follow S5. The published networks were trained from scratch following S5. The browser loads these saved weights for inference; it does not train the networks.",
    "前向模型有三个 64 单元 tanh 隐藏层。有界逆向模型有两个 64 单元 tanh 隐藏层，使用规定的分散度惩罚，通过冻结的前向网络学习。Adam 设置遵循 S5。已发布网络按 S5 从头训练。浏览器加载已保存权重进行推断，不执行训练。"
  ],
  [
    "Calibration & bootstrap ↓",
    "校准与自助法 ↓"
  ],
  [
    "Trained networks ↓",
    "已训练网络 ↓"
  ],
  [
    "Data checksums ↓",
    "数据校验值 ↓"
  ],
  [
    "Verification report ↓",
    "验证报告 ↓"
  ],
  [
    "Green silicon constants",
    "Green 硅光学常数"
  ],
  [
    "Phillips MAPbI₃ constants",
    "Phillips MAPbI₃ 光学常数"
  ],
  [
    "ASTM G173 spectrum",
    "ASTM G173 光谱"
  ],
  [
    "Data sources:",
    "数据来源："
  ],
  [
    "Direct paper-equation evaluation",
    "直接计算论文方程"
  ],
  [
    "Mie lookup, spectral weighting, S2 size average and exposed-cap response; no output clipping.",
    "米氏查找表、光谱加权、S2 尺寸平均及暴露球冠响应；输出不截断。"
  ],
  [
    "Necessary physical checks passed",
    "已通过必要物理检查"
  ],
  [
    "Necessary checks passed",
    "已通过必要检查"
  ],
  [
    "For all five members, absolute current, voltage and fill factor are positive and finite, and current is below the diagnostic ceiling. Relative changes may be negative. This does not establish device feasibility.",
    "五个成员的绝对电流、电压和填充因子均为正且有限，电流低于诊断上限。相对变化可以为负。这不证明器件可行性。"
  ],
  [
    "Unvalidated · failed check",
    "未经验证 · 未通过检查"
  ],
  [
    "Limits to review",
    "需要审查适用范围"
  ],
  [
    "Nonpositive or nonfinite response",
    "非正值或非有限响应"
  ],
  [
    "At least one member gives an invalid absolute response. The equations have not been clipped.",
    "至少一个成员给出无效绝对响应。方程输出未被截断。"
  ],
  [
    "Photon-budget check failed",
    "未通过光子预算检查"
  ],
  [
    "Estimated current exceeds the unity-collection ceiling in the paper’s spectral window. This is a model extrapolation, not a validated device recommendation.",
    "估算电流超过论文光谱窗口内的单位收集效率上限。这属于模型外推，不是经验证的器件建议。"
  ],
  [
    "S2 diameter-grid limitation",
    "S2 直径网格限制"
  ],
  [
    "Outside calibration spacing",
    "超出校准间距范围"
  ],
  [
    "Back-side response is unspecified",
    "后侧响应未指定"
  ],
  [
    "The paper supplies no separate back-side optical kernel. The stated equations give the same response for front and back.",
    "论文未提供单独的后侧光学核。给定方程对前侧和后侧给出相同响应。"
  ],
  [
    "Mesoporous parameter identifiability",
    "介孔参数可辨识性"
  ],
  [
    "Gamma and delta are unidentified by the calibration anchors because their exposed-cap penalty is zero. Solver zeros do not establish zero uncertainty.",
    "由于校准点的暴露球冠惩罚为零，γ 和 δ 无法由这些校准点辨识。求解器取零不代表不确定性为零。"
  ],
  [
    "Surrogate cross-check",
    "代理模型交叉检查"
  ],
  [
    "Normalised gain G/Gref",
    "归一化增益 G/Gref"
  ],
  [
    "Normalised cap penalty Π/Πref",
    "归一化球冠惩罚 Π/Πref"
  ],
  [
    "S2 distribution integral",
    "S2 分布积分"
  ],
  [
    "Diagnostic baseline current",
    "诊断基准电流"
  ],
  [
    "Unity-collection ceiling",
    "单位收集效率上限"
  ],
  [
    "DIRECT-EQUATION VERIFICATION",
    "直接方程验证"
  ],
  [
    "Unvalidated · failed physical check",
    "未经验证 · 未通过物理检查"
  ],
  [
    "Assumptions and extrapolation to review",
    "需要审查的假设与外推"
  ],
  [
    "Diameter",
    "直径"
  ],
  [
    "Dispersion σ/d",
    "分散度 σ/d"
  ],
  [
    "Spacing",
    "间距"
  ],
  [
    "Inspect in explorer →",
    "在探索器中查看 →"
  ],
  [
    "Checks are necessary, not experimental validation.",
    "这些检查是必要条件，并非实验验证。"
  ],
  [
    "Robust proposal · risk-adjusted gain",
    "稳健候选方案 · 风险调整增益"
  ],
  [
    "Next experiment · maximum disagreement",
    "下一步实验 · 最大分歧"
  ],
  [
    "Calculating…",
    "正在计算…"
  ],
  [
    "Comparing 512 candidates…",
    "正在比较 512 个候选方案…"
  ],
  [
    "Design link copied.",
    "已复制设计链接。"
  ],
  [
    "Clipboard unavailable. Export the result to save this design.",
    "剪贴板不可用。请导出结果以保存此设计。"
  ],
  [
    "Complete all design fields.",
    "请填写全部设计字段。"
  ],
  [
    "The shared design link is invalid.",
    "共享设计链接无效。"
  ],
  [
    "Enter nine finite design values.",
    "请输入九个有限的设计参数值。"
  ],
  [
    "Invalid side or doping selection.",
    "前后侧或掺杂选择无效。"
  ],
  [
    "Linearised efficiency change (%)",
    "线性化效率变化（%）"
  ],
  [
    "Relative current change (%)",
    "相对电流变化（%）"
  ],
  [
    "Mean particle diameter (nm)",
    "平均粒子直径（nm）"
  ],
  [
    "8 inputs",
    "8 个输入"
  ],
  [
    "64 tanh",
    "64 个 tanh 单元"
  ],
  [
    "3 outputs",
    "3 个输出"
  ],
  [
    "Standardised inputs → tanh hidden layers → linear relative-response outputs",
    "标准化输入 → tanh 隐藏层 → 线性相对响应输出"
  ],
  [
    "SiMie members 1–5 correspond to members 0–4 in Supplement Tables S4–S5, in the same order.",
    "SiMie 成员 1–5 按相同顺序对应补充表 S4–S5 中的成员 0–4。"
  ],
  [
    "For λ < hc/Eg; w = 0 otherwise.",
    "λ < hc/Eg 时采用此权重；否则 w = 0。"
  ],
  [
    "Compare experiment candidates.",
    "比较实验候选方案。"
  ],
  [
    "Risk-adjusted criterion",
    "风险调整准则"
  ],
  [
    "Uncertainty criterion",
    "不确定性准则"
  ],
  [
    "max s, with μ ≥ τ (upper quartile)",
    "在 μ ≥ τ（上四分位数）条件下最大化 s"
  ],
  [
    "Rejected candidate",
    "已拒绝的候选方案"
  ],
  [
    "Rejected · failed physical checks",
    "已拒绝 · 未通过物理检查"
  ],
  [
    "Failed physical checks. Shown for diagnosis only; not recommended for an experiment.",
    "未通过物理检查。仅供诊断，不建议用于实验。"
  ],
  [
    "Inspect failed calculation →",
    "检查未通过的计算 →"
  ],
  [
    "No eligible uncertainty candidate",
    "没有符合条件的不确定性候选方案"
  ],
  [
    "No eligible risk-adjusted candidate",
    "没有符合条件的风险调整候选方案"
  ],
  [
    "The model could not load. Open SiMie through its website or a local web server.",
    "模型加载失败。请通过网站或本地网页服务器打开 SiMie。"
  ],
  [
    "A required model resource could not be loaded. Reload the page.",
    "无法加载必要的模型资源。请重新加载页面。"
  ],
  [
    "Scientific worker could not start.",
    "科学计算模块无法启动。"
  ],
  [
    "The prescribed numerical grid gives nonfinite values for this sweep.",
    "规定梯形网格在此扫描中产生非有限值。"
  ],
  [
    "The new trained networks have not been packaged.",
    "新训练的网络尚未打包。"
  ],
  [
    "Unknown calculation",
    "未知计算类型"
  ],
  [
    "Fresh paper ensemble required.",
    "需要论文所用的网络集成。"
  ],
  [
    "Unknown ensemble member.",
    "未知集成成员。"
  ],
  [
    "A nonempty candidate set and nonnegative finite kappa are required.",
    "需要非空候选集合及非负、有限的 κ。"
  ],
  [
    "Optical-table extrapolation is not permitted.",
    "不允许超出光学数据表范围外推。"
  ],
  [
    "The S2 optical grid is incomplete.",
    "S2 光学网格不完整。"
  ],
  [
    "Diameter sweep is loading",
    "正在加载直径扫描"
  ]
]);
zh.set('Help','帮助');zh.set('Open user manual','打开用户手册');
export function translateChinese(s){
 if(zh.has(s))return zh.get(s);
 if(/^[−+\d.,eE\s]+ nm$/.test(s))return s;
 if(s.endsWith(' is outside Table 1.'))return s.replace(' is outside Table 1.',' 超出表 1 范围。');
 if(s.includes(' across particle diameters 60 to 260 nm'))return translateChinese(s.replace(' across particle diameters 60 to 260 nm',''))+'，粒子直径为 60–260 nm';
 if(s.endsWith(' versus mean diameter. Current context and dispersion fixed.'))return translateChinese(s.replace(' versus mean diameter. Current context and dispersion fixed.',''))+' 随平均直径变化。当前器件条件和分散度固定。';
 if(s.startsWith('Full-data fit: '))return s.replace('Full-data fit: ','全数据拟合：');
 if(s.includes('ensemble SD'))return s.replace('ensemble SD','集成标准差');
 if(s.startsWith('Ensemble member '))return s.replace('Ensemble member ','集成成员 ');
 if(s.startsWith('Largest difference between surrogate'))return s.replace('Largest difference between surrogate and direct-equation ensemble means: ','代理与直接方程集成均值的最大差异：').replace('percentage points. The cards above use the direct calculation.','个百分点。上方卡片采用直接计算。');
 if(s.startsWith('The prescribed trapezoid grid integrates'))return s.replace('The prescribed trapezoid grid integrates the size distribution to ','规定梯形网格上的尺寸分布积分为 ').replace('. Tails or a very narrow distribution are under-resolved; no renormalisation has been added.','。尾部或极窄分布分辨不足；未加入重新归一化。');
 if(/^The (planar|mesoporous) anchors use/.test(s))return s.replace('The planar anchors use ','平面结构校准点采用 ').replace('The mesoporous anchors use ','介孔结构校准点采用 ').replace('nm spacing. Table 1 permits this value, but the prediction is an extrapolation.','nm 间距。表 1 允许该值，但预测属于外推。');
 if(s.startsWith('Fixed context: '))return s.replace('Fixed context: ','固定器件条件：').replace('absorber','吸收层').replace('transport','传输层').replace('mesoporous','介孔').replace('planar','平面').replace('front side','前侧').replace('back side','后侧').replace('intrinsic silicon','本征硅').replace('p-type silicon','p 型硅');
 if(s.startsWith('Direct-equation mean − target'))return s.replace('Direct-equation mean − target (percentage points): ','直接方程均值 − 目标（百分点）：');
 if(s.startsWith('Member physics − target'))return s.replace('Member physics − target (percentage points): ','成员物理模型 − 目标（百分点）：');
 if(s.startsWith('Surrogate μ ± s:'))return s.replace('Surrogate μ ± s:','代理模型 μ ± s：');
 if(s.startsWith('Direct μ ± s:'))return s.replace('Direct μ ± s:','直接计算 μ ± s：');
 if(s.startsWith('512 seeded candidates'))return s.replace('512 seeded candidates','512 个可复现候选方案').replace('% linearised gain','% 线性化增益').replace('No photon-budget cap or feasibility constraint has been added to the selection equations.','选择方程中未添加光子预算上限或可行性约束。');
 if(s.includes('newly sampled designs'))return s.replace('newly sampled designs','个新采样设计').replace('newly trained forward/inverse pairs','对重新训练的前向/逆向网络').replace('full-batch Adam steps per stage and member','次全批量 Adam 步数（每阶段、每成员）').replace('train/holdout split. Forward and inverse run in the browser; no server is required.','训练/留出比例。前向和逆向计算在浏览器运行，无需服务器。');
 if(s.startsWith('SiMie · '))return 'SiMie · '+translateChinese(s.slice(8));
 if(s.endsWith(' slider'))return translateChinese(s.slice(0,-7))+' 滑块';
 const unit=s.match(/^(.*) \((nm|eV|σ\/d|fraction)\)$/);if(unit)return translateChinese(unit[1])+' ('+translateChinese(unit[2])+')';
 if(s.startsWith('Actual forward activations from ensemble member '))return s.replace('Actual forward activations from ensemble member ','集成成员的实际前向激活值：');
 if(s.startsWith('d = '))return s.replace('shell =','覆盖率 =');
 if(s.startsWith('Weight '))return s.replace('Weight ','权重 ');
 if(s.startsWith('Layer '))return s.replace('Layer ','层 ').replace('unit','单元');
 if(s.includes('versus diameter, from 60 to 260 nanometres. Current design '))return s.replace('Linearised efficiency change (%)','线性化效率变化（%）').replace('Relative current change (%)','相对电流变化（%）').replace('versus diameter, from 60 to 260 nanometres. Current design ','随直径（60–260 nm）变化。当前设计 ').replace('nanometres.','nm。');
 if(s.startsWith('Planar '))return s.replace('Planar ','平面结构 ');
 if(s.startsWith('Mesoporous '))return s.replace('Mesoporous ','介孔结构 ');
 if(s.includes(' · '))return s.split(' · ').map(translateChinese).join(' · ');
 return s;
}
