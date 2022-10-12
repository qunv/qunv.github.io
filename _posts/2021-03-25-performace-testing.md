[comment]: <> (Tổng hợp kiến thức về Performance Test)

[comment]: <> (testing,self)

> Tổng hợp kiến thức về Performance test.

### What is performance testing?

Mục đích: Để xác định hoặc xác thực tốc độ, khả năng mở rộng và/hoặc độ tin cậy của hệ thống.

Notes: Một performance test là một kĩ thuật test để xác định hoặc xác thực các đặc trưng về khả năng đáp ứng, tốc độ,
khả năng mở rộng và/hoặc độc tin cậy của hệ thống dưới dạng test.

### Key Types of Performance Testing

Một số loại performace test thường dùng.

<table>
  <thead>
    <tr>
      <th>Term</th>
      <th>Purpose</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Load test</td>
      <td>Để xác thực hệ hành vi của hệ thống dưới các điều kiện tải bình thường và cao điểm</td>
      <td>
        <ul>
          <li>Load testing được tiến hành để các định xem hệ thống có đám ứng được mục tiêu về hiệu suất mong muốn. Các mục tiêu hiệu suất này thường được quy định trong thỏa thuận dịch vụ (SLA). Một load test cho phép do response times, throughput, rates, và resource - utilization levels, và để xác định break point trong hệ thống, giả định rằng break point này xuất hiện dưới tải cao nhất.</li>
          <li>Kiểm tra độ bền của hệ thống (<b>Soak testing</b>) là một tập các load testing. Môt Soak testing là một loại của performance testing tập trung vào xác định hoặc xác thực các đặc tính hiệu suất của hệ thống dưới test khi phải tuân theo khối lượng công việc và khối lượng đấy tải dự kiến trong quá trình hoạt động trong thời gian dài</li>
          <li><b>Soak testing</b> có thể được sử dụng để tính toán Mean Time Between Failure (MTPF), Mean Time to Failure (MTTF) và các metrics tương tự</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Stress test</td>
      <td>Để xác định hoặc xác thực hành vi hệ thống khi bị đấy ra ngoài điều kiện tải bình thường và cao điểm</td>
      <td>
        <ul>
          <li>Mục tiêu của Stress Test là phát hiện ra các lỗi hệ thống chỉ xuất hiện trong điều kiện tải cao. Những lỗi này có thể bao gồm những thứ như vấn đề đồng bộ hóa, race conditions và rò rỉ bộ nhớ. Stress test cho phép bạn xác định điểm yếu của hệ thống và hiển thị cách hệ thống hoạt động trong điều kiện tải khắc nghiệt.</li>
          <li><b>Spike test</b> là một loại của Stress test. Spike test là một loại performance test tập trung vào việc xác định hoặc xác nhận các đặc tính hoạt động của hệ thống cần test khi chịu các kịch bản mô phỏng khối lượng công việc và khối lượng tải liên tục tăng lên vượt ngoài khả năng hoạt động dự kiến trong thời gian ngắn.</li>
          <li><b>Biggest challenge:</b> Đảm bảo hệ thống vẫn bảo mật các dữ liệu nhạy cảm sau sự cố. Nếu một Stress test thành công, hệ thóng sẽ trở lại bình thường cùng với tất cả các thành phần của nó sau sự cố khủng khiếp nhất.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Capacity test</td>
      <td>Để xác định bao nhiêu user hoặc transations của hệ thống nhất định hỗ trợ nhưng vẫn đáp ứng được mục tiêu hiệu suất.</td>
       <td>
        <ul>
          <li>Capacity test được tiến hành cùng với việc lập kế hoạch cho sự phát triển trong tương lai, chẳng hạn như tăng user base hoặc tăng khối lượng dữ liệu. Ví dụ: để đáp ứng các tải trong tương lai, cần biết có bao nhiêu tài nguyên bổ sung (như dung lượng bộ xử lý, sử dụng bộ nhớ, dung lượng đĩa hoặc băng thông mạng) cần thiết để hỗ trợ các mức sử dụng trong tương lai.</li>
          <li>Capacity test giúp xác nhận một scaling strategy để xác định liệu hệ thống có nên scale up hoặc scale out</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Performance test metrics

1. Response time

2. Component response times

3. Resource utilizations

4. Volumes, capacities and rates

5. Trends

### Core Activities of Performance testing

1. `Identify the Test Environment`. Xác định môi trường vật lý cho việc test và môi trường prod cũng như tools và tài
   nguyên sẵn có đến nhóm test. Môi trường vật lý bao gồm phần cứng, phần mềm, và cấu hình network. Có hiểu biết về môi
   trường test cho phép lên kế hoạch và thiết kế một cách hiệu quả hơn và giúp xác định sớm các vấn đề của project.
   Trong một số tình huống, process này cần được xem lại trong toàn bộ vòng đời của dự án.

2. `Identify Performance Acceptance Criteria`. Xác định response time, throughput, và các mục tiêu và ràng buộc về tài
   nguyên. Nói chung, response time là một user concern. throughput lag một business concern và resource là system
   concern. Chú ý rằng việc test có thể không đáp ứng được mục tiêu.

3. `Plan and Design Test`: Xác định các kịch bản chính, xác định sự thay đổi của người dùng đại diện (CCU) và làm thế
   nào để mô phỏng sự thay đổi đó, định nghĩa dữ liệu test và thiết lập các metrics cần thu thập. Thống nhất lại các
   thông tin thành một hoặc nhiều mô hình của hệ thống sử dụng để thực thi và phân tích.

4. `Config the Test Environment`. Chuẩn bị môi trường test , tools, và các tài nguyên cần thiết để thực thi mỗi kịch
   bản (hay chiến lược) như tính năng và các thành phần có sẵn để test. Đảm bảo rằng môi trường test là công cụ để giám
   sát tài nguyên là cần thiết.

5. `Implement the Testing Design`. Phát triển các bài kiểm tra hiệu suất phù hợp với thiết kế kiểm tra.

6. `Execute the Test`. Chạy và giám sát các bài kiểm tra của bạn. Xác thực các thử nghiệm, dữ liệu thử nghiệm và thu
   thập kết quả. Thực hiện các thử nghiệm đã được xác thực để phân tích trong khi theo dõi thử nghiệm và môi trường thử
   nghiệm.

7. `Analyze Results, Report and Retest`

### Formula of Main metrics

Một số metrics chủ yếu và công thức tính cần quan tâm khi thực hiện performance testing.

Quy ước:

`Values` là tập thời gian phản hồi của từng request,

`C` là số lượng request xử lý

`T` là tổng thời gian xử lý request

`S` là tổng số request success

`E` là tổng số request error

<table>
  <thead>
    <tr>
      <th>Metrics</th>
      <th>Formula</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Response Time</td>
      <td>T</td>
      <td>Là thời gian phản hồi của hệ thống từ lúc VUs gửi request tới lúc nhận được phản hồi.</td>
    </tr>
    <tr>
      <td>Min</td>
      <td>min(values)</td>
      <td>Là thời gian phải hồi nhỏ nhất trong tập thời gian phản hồi</td>
    </tr>
    <tr>
      <td>Avg</td>
      <td>T / C </td>
      <td>Thời gian phản hồi trung bình</td>
    </tr>
    <tr>
      <td>Med</td>
      <td>
        <ul>
            <li>Nếu C & 0x01 = 0 thì med = Values[C/2-1] + Values[C/2]</li>
            <li>Nếu C & 0x01 != 0 thì med = Values[C/2]</li>
        </ul>
      </td>
      <td>median time of values</td>
    </tr>
    <tr>
      <td>P(n)</td>
      <td>
        <ul>
            <li>Sắp xếp values tăng dần</li>
            <li>i = (n/100) * (c - 1.0)</li>
            <li>j = Values[floor(i)]</li>
            <li>k = Values[ceil(i)]</li>
            <li>f = i - floor(i)</li>
        </ul>
        => P(n) = i+(k-j)*f
      </td>
      <td>
        Percentile là một phép do về mặt thống kê. cho biết n phân trăm response time tốt hơn hoặc bằng giá trị tính toán được.
        <ul>
            <li>floor(2.4) = [2.4] = 2</li>
            <li>ceil(2.4) = [2.4] = 3</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Request</td>
      <td>C</td>
      <td>Tổng số request được tạo trong T time</td>
    </tr>
    <tr>
      <td>TPS</td>
      <td>C / T</td>
      <td>Số request xử lý được trong 1s</td>
    </tr>
    <tr>
      <td>Successes</td>
      <td>S * 100 / C </td>
      <td>Tỉ lệ phần trăm success response trên tổng số request</td>
    </tr>
    <tr>
      <td>Errors</td>
      <td>E * 100 / C </td>
      <td>Tỉ lệ phần trăm error response trên tổng số request</td>
    </tr>
  </tbody>
</table>

### Additional Considerations

Một cách tiếp cận để xác định có hệ thống có chạy ổn định hay không để hợp nhất các số liệu là chạy ít nhất một kịch bản
5 lần và áp dụng các quy tắc bên dưới.

+ Nếu nhiều hơn `20%` hoặc một trong `5 lần` chạy có kết quả thực thi có vẻ không giống với phần còn lại thì thường có
  gì đó không ổn với môi trường thử nghiệm, ứng dụng hoặc bản thân ứng dụng test.

* Nếu mỗi thời gian trong 1 lần thử nghiệm cao hơn hoặc thấp hơn đáng kể trên biểu đồ so với kết quả của tất cả các lần
  thực thi trong những lần khác thì nó không đúng về mặt thống kê, suy ra hệ thống có vấn đề.

- Nếu 1 giá trị `P95` của bất kì việc thực thi test nào lớn hơn giá trị lớn nhất hoặc nhỏ hơn giá trị nhỏ nhất của bất
  kì kịch bản test nào thì nó không đúng về mặt thống kê.

+ Nếu thời gian duy nhất trong quá trình thực thi test cao hơn hoặc thấp hơn đáng kể trên biểu đồ so với tất cả các kết
  quả còn lại của quá trình thực thi kiểm tra, nhưng kết quả cho thấy tất cả thời gian còn lại trong quá trình thực thi
  kiểm tra đó thì không.

### Frequently Reported Performance Data

Dưới đây là dữ liệu được báo cáo thường xuyên nhất:

1. End user response times

   Considerations

    - Loại bỏ các ngoại lệ trước khi báo cáo

    + Đảm bảo các dữ liệu thống kê được báo cáo rõ ràng. Ví dụ về sự khác nhau giữa P90 và giá trị trung bình (avg) cho
      thấy vấn đề của hệ thống.

    * Báo cáo các giá trị ngoại lệ được bỏ qua

2. Resource utilizations

   Các báo cáo về tài nguyên phần cứng được báo cáo về lời nói hoặc tường thuật

   Additional Considerations

    - Biết khi nào báo cáo tất cả dữ liệu, khi nào cần tóm tắt. Thông thường để đơn giản chỉ cần báo cáo giá trị đạt
      đỉnh khi monitor.

3. Volumes, capacities and rates

4. Component response times

5. Trends

### Questions To Be An Answered By Report

1. All Roles

    - Is performance getting better or worse?

    + Have we met the requirements/service level agreements (SLAs)?

    * What reports are available?

    - How frequently can I get reports?

    + Can I get a report with more/less detail?

2. Executive Stakeholders

    - Is this ready to ship?

    + How will these results relate to production?

    * How much confidence should I have in these results?

    - What needs to be done to get this ready to ship?

    + Is the performance testing proceeding as anticipated?

    * Is the performance testing adding value?

3. Project - Level Managers

    - Are performance issues being detected efficiently?

    + Are performance issues being resolved efficiently?

    * What performance testing should we be conducting that we currently are not?

    - What performance testing are we currently doing that is not adding value?

    + Are there currently any blockers? If so, what are they?

4. Technical Team Members

    - What do these results mean to my specialty/focus area?

    + Where can I go to see the results for the last test?

    * Where can I go to get the raw data?

    - Can you capture metric X during the next test run?

### What does the report need?

1. Raw data display

    - Baseline

    + Benchmark

    * Scalability

    - Any other user-experience-based test

2. Data storage

    - Spreadsheets

    + Text files

    * Data collection tool

3. Technical Reports

    - Description of the test, including workload model and test environment

    + Easily digestible data with minimal pre-processing

    * Access to the complete data set and test conditions

    - Short statements of observations, concerns, questions, and requests for collaboration

    + Include:

        - Scatter plots

        + Pareto charts

        * Trend charts

        - Summary spreadsheets