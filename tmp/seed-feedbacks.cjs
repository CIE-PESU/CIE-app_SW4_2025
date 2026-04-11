const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const courseId = 'cmnn2dlpr0000grq08z26szk9' // PAML course
  
  const units = [
    { id: 'cmno7dr3d000fgr5sn7cb2gh2', name: 'Introduction to AI, ML, DL, Data Preparation, Data Processing and Feature Engineering', number: 1 },
    { id: 'cmno7dr3m000hgr5so23l43xp', name: 'Classification and Regression', number: 2 },
    { id: 'cmno7dr3u000jgr5s965bxi6l', name: 'Neural Networks', number: 3 },
    { id: 'cmno7dr42000lgr5sopvb031u', name: 'Computer Vision', number: 4 },
    { id: 'cmno7dr4d000ngr5s1zr9kpyk', name: 'NLP and Gen AI', number: 5 },
  ]

  const students = [
    { id: 'cmlhumfua0009s36blogtjlo4', name: 'Preetham Kumar S' },
    { id: 'cmlhumfui000bs36b4dgcd29i', name: 'Rishi D V' },
    { id: 'cmlhumfuq000ds36bwidu4rhj', name: 'Samir G D' },
    { id: 'cmlhumfuy000fs36b4q8hkg1s', name: 'Sneha' },
    { id: 'cmlhumfv6000hs36b6xyjcm3u', name: 'Anivartha U' },
    { id: 'cmlhumfvf000js36bz5p03h60', name: 'Dhanush' },
    { id: 'cmlhumfvo000ls36bitw9cj4g', name: 'Priya Deshmukh' },
    { id: 'cmlhumfvw000ns36bnoak47zq', name: 'Nikhil' },
    { id: 'cmlhumfw5000ps36bnyi0rcn1', name: 'Vismayii' },
    { id: 'cmlhumfwe000rs36b200lvq3g', name: 'Ranjith Kumar' },
    { id: 'cmlhumfwl000ts36bcw9umk92', name: 'Akshay M' },
    { id: 'cmlhumfws000vs36b838dgkx3', name: 'Aishwarya C' },
    { id: 'cmlhumfx0000xs36bmhnbxryo', name: 'Pratham M' },
    { id: 'cmlhumfx8000zs36bsxo9io1n', name: 'Rachan D' },
    { id: 'cmlhumfxg0011s36bkn6zdjsd', name: 'Pavan P' },
  ]

  // Feedback data per unit - realistic student feedbacks for a Machine Learning course
  const feedbackData = {
    // Unit 1: Introduction to AI, ML, DL, Data Preparation...
    1: [
      { studentIdx: 0, rating: 5, comment: "The introduction was very clear and the data preprocessing lab exercises were extremely helpful. Sir explained the difference between AI, ML and DL with great examples.", suggestions: "Maybe add a small quiz at the end of each subtopic to help reinforce learning." },
      { studentIdx: 1, rating: 4, comment: "Good overview of the ML landscape. Feature engineering was the most interesting part. The hands-on exercises with pandas and numpy were useful.", suggestions: "More real-world datasets for practice would be great." },
      { studentIdx: 2, rating: 5, comment: "Excellent introduction! The data processing pipeline explanation was very clear. I liked how we went from raw data to clean features step by step.", suggestions: null },
      { studentIdx: 3, rating: 4, comment: "Loved the practical approach. The Jupyter notebook walkthroughs made it easy to follow along. Feature engineering techniques were well explained.", suggestions: "Could use more time on handling missing data strategies." },
      { studentIdx: 4, rating: 3, comment: "The content was good but felt a bit rushed towards the end. Data preparation concepts were clear but feature engineering needed more depth.", suggestions: "Please slow down on feature engineering and give more examples." },
      { studentIdx: 5, rating: 5, comment: "Amazing start to the course! The live coding session for data preprocessing was the highlight. Never thought data cleaning could be this interesting.", suggestions: null },
      { studentIdx: 6, rating: 4, comment: "Well-structured unit. The distinction between supervised and unsupervised learning was made crystal clear. Data preprocessing labs were practical.", suggestions: "Add a cheat sheet for common preprocessing steps." },
      { studentIdx: 7, rating: 4, comment: "Good foundational unit. The EDA section was particularly useful. Would have liked more time on feature selection techniques.", suggestions: "Include feature selection methods like mutual information and chi-squared tests." },
      { studentIdx: 8, rating: 5, comment: "Very engaging lectures. The real-world examples of how data preparation impacts model performance were eye-opening.", suggestions: null },
      { studentIdx: 9, rating: 4, comment: "Solid introduction. The lab sessions complemented the theory well. Data processing pipeline was well explained with practical examples.", suggestions: "More practice problems for homework." },
      { studentIdx: 10, rating: 3, comment: "Content was decent. Some parts felt repetitive if you already know basic Python. Feature engineering section was valuable though.", suggestions: "Consider a prerequisite assessment to better tailor the pace." },
      { studentIdx: 11, rating: 5, comment: "Brilliant start! Sir's teaching style is very engaging. The hands-on approach from day one set the right expectation for the course.", suggestions: null },
    ],

    // Unit 2: Classification and Regression
    2: [
      { studentIdx: 0, rating: 5, comment: "The comparison between different classification algorithms was very well done. Decision trees and random forests were explained with great visualizations.", suggestions: "Can we get a comparison table of when to use which algorithm?" },
      { studentIdx: 1, rating: 4, comment: "Regression concepts were clear. Liked the practical approach of building models from scratch before using sklearn. The evaluation metrics section was thorough.", suggestions: null },
      { studentIdx: 2, rating: 4, comment: "Good coverage of both classification and regression. The SVM explanation with kernel trick was excellent. Lab exercises were challenging but doable.", suggestions: "More practice with hyperparameter tuning." },
      { studentIdx: 3, rating: 5, comment: "This unit really brought ML to life! Building a complete classification pipeline from data to prediction was amazing. The confusion matrix explanation was the clearest I've seen.", suggestions: null },
      { studentIdx: 4, rating: 4, comment: "Well-taught unit. Logistic regression derivation was clear. Practical sessions with real datasets made the concepts stick.", suggestions: "Include more about gradient boosting methods like XGBoost." },
      { studentIdx: 5, rating: 3, comment: "Content was good but the mathematical derivations could have been explained more slowly. The lab sessions were the best part.", suggestions: "Please provide reference materials for the math behind algorithms." },
      { studentIdx: 6, rating: 5, comment: "Loved the hands-on approach! Building a house price predictor and a spam classifier in the lab was very engaging and practical.", suggestions: null },
      { studentIdx: 7, rating: 4, comment: "Strong unit overall. Cross-validation and evaluation metrics were well covered. Would like more emphasis on real-world deployment considerations.", suggestions: "Add a section on model serialization and deployment." },
      { studentIdx: 8, rating: 5, comment: "Excellent teaching! The step-by-step walkthrough of building classifiers and regressors with proper evaluation was very methodical and clear.", suggestions: "Maybe include ensemble methods in more detail." },
      { studentIdx: 9, rating: 4, comment: "Good pace and content. The comparison of linear vs logistic regression was helpful. Lab assignments were well-designed.", suggestions: null },
      { studentIdx: 12, rating: 5, comment: "Best unit so far! The practical examples were relatable and the code was clean and well-commented. Really appreciate the teaching methodology.", suggestions: null },
      { studentIdx: 13, rating: 4, comment: "Solid coverage of classification and regression. The visual explanations of decision boundaries were very helpful.", suggestions: "Include a brief intro to AutoML tools." },
    ],

    // Unit 3: Neural Networks  
    3: [
      { studentIdx: 0, rating: 4, comment: "Neural networks explained from scratch! The backpropagation walkthrough was challenging but rewarding. Building a neural net in numpy before using PyTorch was great.", suggestions: "More visual explanations of gradient flow would help." },
      { studentIdx: 1, rating: 5, comment: "The transition from traditional ML to neural networks was seamless. Loved how sir built intuition before diving into the math. PyTorch intro was excellent.", suggestions: null },
      { studentIdx: 2, rating: 4, comment: "Good coverage of feed-forward networks, activation functions, and optimization. The MNIST digit recognition lab was a great practical exercise.", suggestions: "Include a section on common neural network debugging techniques." },
      { studentIdx: 3, rating: 3, comment: "Content was good but felt dense. The mathematical derivations for backpropagation were hard to follow in one session. Labs helped clarify things.", suggestions: "Break backpropagation into two sessions instead of one." },
      { studentIdx: 4, rating: 5, comment: "Excellent unit! Understanding gradient descent visually and then implementing it was a great learning experience. The loss landscape visualization was mind-blowing.", suggestions: null },
      { studentIdx: 5, rating: 4, comment: "Strong foundational unit for deep learning. The Adam optimizer explanation was very clear. Batch normalization and dropout were well motivated.", suggestions: "Add more ablation study examples to show effect of hyperparameters." },
      { studentIdx: 6, rating: 4, comment: "Good hands-on sessions. Building a multi-layer perceptron from scratch gave deep understanding. The transition to PyTorch was smooth.", suggestions: null },
      { studentIdx: 7, rating: 5, comment: "Outstanding explanation of neural network fundamentals! The animated visualizations of forward and backward passes were incredibly helpful.", suggestions: "Maybe a mini-project on a real dataset at the end of this unit." },
      { studentIdx: 8, rating: 4, comment: "Well-paced unit. The comparison of different activation functions and their gradients was insightful. Practical exercises were well-designed.", suggestions: "Include more about regularization techniques." },
      { studentIdx: 10, rating: 3, comment: "Heavy on math which was challenging. But the labs made it practical. Would appreciate more step-by-step worked examples during lectures.", suggestions: "Provide pre-lecture reading materials so we can prepare in advance." },
      { studentIdx: 11, rating: 5, comment: "Loved this unit! The visual approach to understanding neural networks made complex concepts accessible. The coding labs were the highlight.", suggestions: null },
      { studentIdx: 14, rating: 4, comment: "Good unit overall. The progression from single neuron to deep networks was logical. Appreciate the practical focus throughout.", suggestions: "Add transfer learning basics as a preview for the next units." },
    ],

    // Unit 4: Computer Vision
    4: [
      { studentIdx: 0, rating: 5, comment: "CNNs were explained beautifully! From convolution operations to building image classifiers with PyTorch. The filter visualization lab was amazing.", suggestions: null },
      { studentIdx: 1, rating: 5, comment: "Best unit of the course! Building an image classification pipeline end-to-end was incredibly satisfying. Data augmentation techniques were well demonstrated.", suggestions: "Include a brief section on object detection (YOLO/SSD)." },
      { studentIdx: 2, rating: 4, comment: "Excellent coverage of CNNs. The progression from LeNet to VGG to ResNet showed clear evolution. Transfer learning practical was very useful.", suggestions: "More time on advanced architectures like EfficientNet." },
      { studentIdx: 3, rating: 5, comment: "Computer vision labs were the most exciting! Building a real image classifier that works on our own photos was magical. Great practical approach.", suggestions: null },
      { studentIdx: 4, rating: 4, comment: "Strong unit. The convolution arithmetic and pooling explanations were crystal clear. OpenCV integration for preprocessing was a nice addition.", suggestions: "Add GAN basics or image generation as an extension topic." },
      { studentIdx: 5, rating: 5, comment: "Loved every minute! The real-time demo of CNN filters detecting edges and patterns was mind-blowing. Transfer learning with pre-trained models was very practical.", suggestions: null },
      { studentIdx: 6, rating: 4, comment: "Well-structured unit. The hands-on lab with custom datasets was challenging and rewarding. Understanding how CNNs 'see' images was fascinating.", suggestions: "Include Grad-CAM or other interpretability methods." },
      { studentIdx: 8, rating: 5, comment: "Incredible teaching! The visual approach to explaining convolution, pooling, and feature maps made complex concepts intuitive. Lab exercises were top-notch.", suggestions: null },
      { studentIdx: 9, rating: 4, comment: "Great unit! Building our own image classifier for a custom problem was the highlight. The model evaluation and error analysis section was very insightful.", suggestions: "More practice with different pretrained models." },
      { studentIdx: 11, rating: 5, comment: "This is what made me fall in love with ML! The practical demos and the final project of building a flower classifier were absolutely brilliant.", suggestions: null },
      { studentIdx: 12, rating: 4, comment: "Very well-taught. The step-by-step building of CNN architectures made the learning curve manageable. Appreciate the detailed lab notebooks.", suggestions: "Add a comparison of different frameworks (TensorFlow vs PyTorch) for CV." },
      { studentIdx: 14, rating: 5, comment: "Phenomenal unit! Sir's enthusiasm for computer vision is contagious. The practical labs were industry-relevant and the teaching was world-class.", suggestions: "A mini-project on medical image analysis would be amazing." },
    ],

    // Unit 5: NLP and Gen AI
    5: [
      { studentIdx: 0, rating: 5, comment: "The NLP journey from bag-of-words to transformers was brilliantly structured. Understanding attention mechanism through visual examples was the highlight.", suggestions: "Add a section on fine-tuning LLMs for specific tasks." },
      { studentIdx: 1, rating: 4, comment: "Great introduction to NLP! Text preprocessing, TF-IDF, and word embeddings were well explained. The sentiment analysis lab was very engaging.", suggestions: "More hands-on with Hugging Face transformers library." },
      { studentIdx: 2, rating: 5, comment: "Mind-blowing unit! Going from basic text processing to understanding how GPT and BERT work was an incredible learning journey. The Gen AI demo was amazing.", suggestions: null },
      { studentIdx: 3, rating: 4, comment: "Excellent coverage of NLP fundamentals. The progression from classical NLP to modern transformers was logical. Prompt engineering section was timely and relevant.", suggestions: "Include more about RAG (Retrieval Augmented Generation)." },
      { studentIdx: 4, rating: 5, comment: "The best way to end the course! Understanding how ChatGPT and other LLMs work under the hood was fascinating. The hands-on with transformers was incredible.", suggestions: null },
      { studentIdx: 5, rating: 4, comment: "Good unit overall. Word2Vec and GloVe explanations were clear. The attention mechanism could use more time. Gen AI overview was very current and relevant.", suggestions: "Dedicate more time to the attention mechanism and self-attention." },
      { studentIdx: 7, rating: 5, comment: "Fascinating unit! Building a simple chatbot using transformer architecture was the highlight of the course. The ethical AI discussion was thought-provoking.", suggestions: null },
      { studentIdx: 8, rating: 4, comment: "Well-paced unit. NLP fundamentals were solid and the bridge to Gen AI was smooth. The live demo of prompt engineering techniques was very practical.", suggestions: "Add a mini-project on building a domain-specific chatbot." },
      { studentIdx: 9, rating: 5, comment: "Incredible finale to the course! Understanding transformers, BERT, and GPT architectures from fundamentals was empowering. The Gen AI practical was outstanding.", suggestions: null },
      { studentIdx: 10, rating: 4, comment: "Strong finish to the course. The NLP pipeline from raw text to model predictions was well demonstrated. Gen AI section was informative and forward-looking.", suggestions: "Include more about responsible AI and bias in language models." },
      { studentIdx: 11, rating: 5, comment: "Perfect ending to an amazing course! The NLP and Gen AI content was cutting-edge. Sir's teaching made complex concepts like attention and transformers accessible.", suggestions: null },
      { studentIdx: 13, rating: 4, comment: "Very relevant unit. The hands-on with Hugging Face models was practical and industry-relevant. Good balance of theory and practice.", suggestions: "A follow-up workshop on deploying NLP models would be great." },
    ],
  }

  let totalCreated = 0

  for (const [unitNum, feedbacks] of Object.entries(feedbackData)) {
    const unit = units[parseInt(unitNum) - 1]
    console.log(`\nSeeding feedbacks for Unit ${unitNum}: ${unit.name}`)
    
    for (const fb of feedbacks) {
      const student = students[fb.studentIdx]
      try {
        await prisma.courseFeedback.create({
          data: {
            course_id: courseId,
            student_id: student.id,
            unit_id: unit.id,
            rating: fb.rating,
            comment: fb.comment,
            suggestions: fb.suggestions,
          }
        })
        console.log(`  ✓ ${student.name} - Rating: ${fb.rating}`)
        totalCreated++
      } catch (error) {
        // Skip if already exists (unique constraint on student_id + unit_id)
        console.log(`  ✗ ${student.name} - Already exists or error: ${error.message?.substring(0, 80)}`)
      }
    }
  }

  console.log(`\n=== Done! Created ${totalCreated} feedback entries ===`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
