export const translations: { [lang: string]: { [key: string]: string } } = {
  en: {
    // StudentInfoForm
    'testTitle': 'Midterm Test',
    'formPrompt': 'Please enter your details to begin.',
    'fullNameLabel': 'Full Name',
    'studentIdLabel': 'Student ID',
    'classCodeLabel': 'Class Code',
    'startTestButton': 'Start Test',
    'fullNamePlaceholder': 'Nguyen Van A',
    'studentIdPlaceholder': '0024412345',
    'classCodePlaceholder': 'ĐHSSINH24Z',

    // QuizGenerator
    'generatingMessage': 'Generating your personalized test... Please wait.',
    'testInstructions': 'The test has 7 parts (75 questions) at B1 Preliminary level. You will have {{minutes}} minutes to complete it.',

    // QuizScreen
    'quizHeader': 'Midterm Test',
    'partLabel': 'Part {{partNumber}}',
    'readingPartLabel': 'Reading Part {{partNumber}}',
    'listeningPartLabel': 'Listening Part {{partNumber}}',
    'readingType': 'Reading',
    'listeningType': 'Listening',
    'listeningInstructions': 'Click the button below to listen to the recording. You can replay it if needed.',
    'listeningPart1Instructions': 'In this part, you will hear EIGHT short announcements or instructions. There is one question for each announcement or instruction. For each question, choose the right answer A, B, C or D. Then, on the answer sheet, find the number of the question and fill in the space that corresponds to the letter of the answer that you have chosen.',
    'listeningPart2Instructions': 'In this part, you will hear THREE conversations. The conversations will not be repeated. There are four questions for each conversation. For each question, choose the correct answer A, B, C or D.',
    'listeningPart3Instructions': 'In this part, you will hear THREE talks, lectures or conversations. The talks, lectures, or conversations will not be repeated. There are five questions for each talk, lecture, or conversation. For each question, choose the right answer A, B, C or D.',
    'playAudio': 'Play Recording',
    'replayAudio': 'Replay Recording',
    'loadingAudio': 'Generating Audio...',
    'questionLabel': 'Question {{questionNumber}}',
    'answeredLabel': 'Answered: {{answered}} / {{total}}',
    'submitTestButton': 'Submit Test',
    'prevButton': 'Previous',
    'nextButton': 'Next',
    'nextPartButton': 'Next Part',
    'finishButton': 'Finish Test',

    // ConfirmationModal
    'confirmSubmitTitle': 'Are you sure?',
    'confirmSubmitMessage_one': 'You still have {{count}} unanswered question. Your test will be graded as is.',
    'confirmSubmitMessage_other': 'You still have {{count}} unanswered questions. Your test will be graded as is.',
    'confirmSubmitButton': 'Submit Anyway',
    'reviewAnswersButton': 'Review Answers',

    // ResultsScreen
    'resultsHeader': 'Test Completed!',
    'nameLabel': 'Name',
    'classLabel': 'Class',
    'feedbackExcellent': 'Excellent!',
    'feedbackGreat': 'Great Job!',
    'feedbackGood': 'Good Effort!',
    'feedbackPractice': 'Keep Practicing!',
    'yourScoreLabel': 'Your Score',
    'screenshotInstruction': 'Please take a screenshot of your results.',
    'uploadScreenshotButton': 'Upload Screenshot to Google Drive',

    // App (Error)
    'errorTitle': 'An Error Occurred',
    'tryAgainButton': 'Try Again',
  },
  vi: {
    // StudentInfoForm
    'testTitle': 'Bài kiểm tra giữa kỳ',
    'formPrompt': 'Vui lòng nhập thông tin của bạn để bắt đầu.',
    'fullNameLabel': 'Họ và Tên',
    'studentIdLabel': 'Mã số sinh viên',
    'classCodeLabel': 'Mã lớp',
    'startTestButton': 'Bắt đầu làm bài',
    'fullNamePlaceholder': 'Nguyễn Văn A',
    'studentIdPlaceholder': '0024412345',
    'classCodePlaceholder': 'ĐHSSINH24Z',

    // QuizGenerator
    'generatingMessage': 'Đang tạo đề thi cá nhân hóa của bạn... Vui lòng đợi.',
    'testInstructions': 'Bài kiểm tra có 7 phần (75 câu hỏi) ở trình độ B1 Preliminary. Bạn sẽ có {{minutes}} phút để hoàn thành.',

    // QuizScreen
    'quizHeader': 'Bài kiểm tra giữa kỳ',
    'partLabel': 'Phần {{partNumber}}',
    'readingPartLabel': 'Phần Đọc {{partNumber}}',
    'listeningPartLabel': 'Phần Nghe {{partNumber}}',
    'readingType': 'Đọc hiểu',
    'listeningType': 'Nghe hiểu',
    'listeningInstructions': 'Nhấn nút bên dưới để nghe đoạn ghi âm. Bạn có thể nghe lại nếu cần.',
    'listeningPart1Instructions': 'Trong phần này, bạn sẽ nghe TÁM thông báo hoặc hướng dẫn ngắn. Có một câu hỏi cho mỗi thông báo hoặc hướng dẫn. Đối với mỗi câu hỏi, hãy chọn câu trả lời đúng A, B, C hoặc D. Sau đó, trên phiếu trả lời, hãy tìm số câu hỏi và điền vào ô tương ứng với chữ cái của câu trả lời mà bạn đã chọn.',
    'listeningPart2Instructions': 'Trong phần này, bạn sẽ nghe BA cuộc hội thoại. Các cuộc hội thoại sẽ không được lặp lại. Có bốn câu hỏi cho mỗi cuộc hội thoại. Đối với mỗi câu hỏi, hãy chọn câu trả lời đúng A, B, C hoặc D.',
    'listeningPart3Instructions': 'Trong phần này, bạn sẽ nghe BA bài nói chuyện, bài giảng hoặc cuộc hội thoại. Các bài nói chuyện, bài giảng hoặc cuộc hội thoại sẽ không được lặp lại. Có năm câu hỏi cho mỗi bài nói chuyện, bài giảng hoặc cuộc hội thoại. Đối với mỗi câu hỏi, hãy chọn câu trả lời đúng A, B, C hoặc D.',
    'playAudio': 'Phát ghi âm',
    'replayAudio': 'Nghe lại',
    'loadingAudio': 'Đang tạo âm thanh...',
    'questionLabel': 'Câu hỏi {{questionNumber}}',
    'answeredLabel': 'Đã trả lời: {{answered}} / {{total}}',
    'submitTestButton': 'Nộp bài',
    'prevButton': 'Quay lại',
    'nextButton': 'Tiếp theo',
    'nextPartButton': 'Phần tiếp theo',
    'finishButton': 'Hoàn thành',

    // ConfirmationModal
    'confirmSubmitTitle': 'Bạn có chắc không?',
    'confirmSubmitMessage_one': 'Bạn vẫn còn {{count}} câu chưa trả lời. Bài thi của bạn sẽ được chấm điểm như hiện tại.',
    'confirmSubmitMessage_other': 'Bạn vẫn còn {{count}} câu chưa trả lời. Bài thi của bạn sẽ được chấm điểm như hiện tại.',
    'confirmSubmitButton': 'Vẫn nộp bài',
    'reviewAnswersButton': 'Xem lại câu trả lời',

    // ResultsScreen
    'resultsHeader': 'Đã hoàn thành bài kiểm tra!',
    'nameLabel': 'Tên',
    'classLabel': 'Lớp',
    'feedbackExcellent': 'Xuất sắc!',
    'feedbackGreat': 'Làm tốt lắm!',
    'feedbackGood': 'Cố gắng nhé!',
    'feedbackPractice': 'Hãy tiếp tục luyện tập!',
    'yourScoreLabel': 'Điểm của bạn',
    'screenshotInstruction': 'Vui lòng chụp ảnh màn hình kết quả của bạn.',
    'uploadScreenshotButton': 'Tải ảnh chụp màn hình lên Google Drive',
    
    // App (Error)
    'errorTitle': 'Đã xảy ra lỗi',
    'tryAgainButton': 'Thử lại',
  },
};