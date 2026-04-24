import re
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.runnables import RunnableLambda
from server.schema import AIAnalysis, DocumentMetrics
from server.config import TestEnv


def _strip_thinking(message) -> str:
    text = message.content if hasattr(message, "content") else str(message)
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()


async def evaluate_ai(raw_text: str, metrics: DocumentMetrics):
    parser = PydanticOutputParser(pydantic_object=AIAnalysis)
    truncated_txt = raw_text[:6000]

    prompt = PromptTemplate(
        template="""You are a Lead Migration Architect auditing technical documentation for Document360.
        Your task is to evaluate the content's qualitative and quantitative aspects to determine its readiness for migration into a digital knowledge base.

        {format_instructions}

        EVALUATION GUIDELINES:
        - Readability: Assess if the language is accessible to the target audience.
        - Clarity: Identify if there are confusing sentences, disjointed thoughts, or inconsistent terminology.
        - Structural Quality: Check if the text flows logically. Are there too many walls of text? Are headings used appropriately?
        - Migration Effort Score: Based on the metrics below and the actual content, estimate complexity on a 0-10 scale, where 0 is trivial and 10 is extremely complex. Consider: document length, paragraph density, heading structure, technical depth, and organization quality.
        - Migration Readiness: Is this ready to publish as-is, needs minor work, or requires heavy rewriting?

        DOCUMENT METRICS:
        - Total Pages: {total_pages}
        - Total Words: {word_count}
        - Paragraph Count: {paragraph_count}
        - Paragraph Density: {avg_words} words per paragraph
        - Heading Count: {heading_count}

        DOCUMENT CONTENT (Truncated for analysis):
        {content}
            """,
        input_variables=["total_pages", "word_count", "paragraph_count", "avg_words", "heading_count", "content"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    llm = ChatOllama(model=TestEnv.ai_model, temperature=0.0, reasoning=True)
    chain = prompt | llm | RunnableLambda(_strip_thinking) | parser

    try:
        return await chain.invoke({
            "total_pages": metrics.total_pages,
            "word_count": metrics.word_count,
            "paragraph_count": metrics.paragraph_count,
            "avg_words": metrics.avg_words_per_paragraph,
            "heading_count": metrics.heading_count,
            "content": truncated_txt
        })
    except Exception as e:
        return AIAnalysis(
            readability_level="Unknown",
            content_clarity="Evaluation failed to process context.",
            structural_quality="Unknown",
            migration_readiness="Requires Manual Review",
            migration_effort_score=5.0,
            improvement_suggestions=[
                "The AI model failed to return a valid structured response.",
                "Verify that the text does not contain unsupported encoding.",
                "Review the document manually for structural integrity."
            ]
        )
