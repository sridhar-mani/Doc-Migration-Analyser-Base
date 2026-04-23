from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from server.schema import AIAnalysis, DocumentMetrics

def evaluate_ai(raw_text: str, metrics: DocumentMetrics):
    parser = PydanticOutputParser(pydantic_object=AIAnalysis)
    truncated_txt = raw_text[:5000]
    prompt = PromptTemplate(
        template="""You are an expert Migration Specialist auditing a document for Document360.
            Review the document metrics and content below.
            
            You must respond ONLY with valid JSON. Do not include markdown tags or explanations outside the JSON.
            
            {format_instructions}
            
            ---
            DOCUMENT METRICS:
            {metrics}
            
            ---
            DOCUMENT CONTENT (Truncated):
            {content}
            """,
            input_variables=["metrics", "content"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    chain = prompt | ChatOllama(model="qwen3.5:9b", temperature=0.0, num_gpu=30) | parser

    try:
        return chain.invoke({"metrics": metrics, "content": truncated_txt})
    except Exception as e:
            return AIAnalysis(
                readability_level="Unknown",
                content_clarity="Evaluation failed due to local model formatting error.",
                structural_quality="Unknown",
                migration_readiness="Needs Restructuring",
                improvement_suggestions=["Re-run analysis", "Check Ollama server"]
            )