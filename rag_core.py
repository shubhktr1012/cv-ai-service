import os #interact with the operating system
import re  
from dotenv import load_dotenv #load environment variables from a .env file
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings #Google Generative AI
from langchain_community.vectorstores import FAISS #FAISS is a vector store for efficient similarity search
from langchain.text_splitter import RecursiveCharacterTextSplitter #split text into chunks
from langchain_community.document_loaders import TextLoader #load text files
from langchain.chains import RetrievalQA #retrieval QA chain to use over your own data
from langchain.prompts import PromptTemplate #prompt template to use over your own data

#Load environment variables
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

#Configure Gemini Model and Embeddings
llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", google_api_key=api_key, temperature=0.3) #temperature is the randomness of the model
embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-004", google_api_key=api_key) #embeddings are the vectors that represent the text

loader = TextLoader("cv.txt", encoding="utf-8") #load text files
documents = loader.load() #load text files
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500, 
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
) #split text into chunks
texts = text_splitter.split_documents(documents) #split text into chunks
vector_store = FAISS.from_documents(texts, embeddings) #FAISS is a vector store for efficient similarity search
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 8, "fetch_k": 40}) #k is the number of results to return, fetch_k is the number of results to fetch

qa_prompt = PromptTemplate.from_template(
    "You are answering strictly from the CV provided to you. The user owns the CV and consents to extracting details.\n"
    "Question: {question}\n\n"
    "Use the context to answer concisely. If not present, reply exactly this: Not found.\n\n"
    "Context:\n{context}"
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    #Other chain_type options: "map_reduce", "refine", "map_rerank"
    retriever=retriever,
    return_source_documents=True,
)

def get_answer_with_sources(query):
    """Gets an answer from the RAG chain"""
    try:
        result = qa_chain.invoke(query)
        answer = result['result']
        sources = [
            {'source': d.metadata.get('source', 'unknown'), 'content': d.page_content[:300] + '...' if len(d.page_content) > 300 else d.page_content}
            for d in result.get('source_documents', [])
        ]
        if not answer:
            answer = "Not found"
        return {"answer": answer, "sources": sources}
    except Exception as e:
        return f"An error occurred: {e}"
    
#Test the RAG chain
if __name__ == "__main__":
    question = "What is the person's phone number in the CV?"
    result = get_answer_with_sources(question)
    print(f"Question: {question}")
    print(f"Answer: {result}")
    print(f"\nRetrieved chunks Preview:")
    for i, d in enumerate(result['source_documents'], 1):
        print(f"\n[{i}] {d.metadata.get('source', 'unknown source')}")
        print(d.page_content[:300])
        print("...")








