The way i have approached the project is as follows:-
1. First I have collected the content from the file that is submitted by the user it format of the file can be .txt, .pdf, .csv file other files are not supported.
2. Then I use huggigface models api to summarize the document within 200-1000 words
3. Then i make an api call to chatgpt api to answer the question from the summerised document

The issues faced by me while completing the project are as follows:-
1. The conda virtualenv was not working so I another virtualenv.
2. I have expired all my openAI credentials so I am not able to make an api call to openAI however this problem can be tackeled at an organisation level or b using other models I have also mentioned how the code would look with openAI api asa comment.
