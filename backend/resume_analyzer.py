import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

def analyze_resume(resume_text, jd_text):
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_text, jd_text])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    resume_doc = nlp(resume_text)
    jd_doc = nlp(jd_text)

    resume_keywords = {token.text.lower() for token in resume_doc if token.pos_ in ["NOUN", "PROPN"]}
    jd_keywords = {token.text.lower() for token in jd_doc if token.pos_ in ["NOUN", "PROPN"]}

    missing = list(jd_keywords - resume_keywords)

    return {
        "similarity_score": round(similarity * 100, 2),
        "missing_keywords": missing
    }
