"""
Questionnaire questions - trimmed to 50 selected questions across three
sections, renumbered sequentially (Q1-Q50). Replaces the earlier 54-question
version built from the full original question set.

Question types:
- "likert": single choice from a 5-point agree/disagree scale
- "multiple_choice": single choice, each option has its own point value
- "boolean": yes/no, each option has its own point value
- "multi_select": pick all that apply, each selected option scores independently

Note: Q39 (about flagged risk mitigation) intentionally scores "all flagged
risks are mitigated" as 0 - the reasoning being that if literally all flagged
risks are resolved, that itself signals risks aren't being flagged rigorously.
"""

LIKERT_OPTIONS = [
    {"label": "Strongly agree", "points": 2},
    {"label": "Somewhat agree", "points": 1},
    {"label": "Neutral", "points": 0.5},
    {"label": "Disagree", "points": 0},
    {"label": "Strongly disagree", "points": 0},
]

LIKERT_REVERSED = [
    {"label": "Strongly agree", "points": 0},
    {"label": "Somewhat agree", "points": 0},
    {"label": "Neutral", "points": 0.5},
    {"label": "Disagree", "points": 1},
    {"label": "Strongly disagree", "points": 2},
]

FREQUENCY_STANDARD = [
    {"label": "Almost every project", "points": 2},
    {"label": "Often", "points": 1},
    {"label": "Sporadically", "points": 0},
    {"label": "This has never happened", "points": 0},
]

DEPARTMENTS_4 = ["Compliance department", "Digital marketing department",
                 "Model development department", "Production and maintenance department"]

SECTION_DATA = "Data, Documentation and Communication"
SECTION_RISK = "Model Risk (Monitoring, QA, Risk Management)"
SECTION_LIFECYCLE = "Development Lifecycle"


def likert(qid, qnum, text, section, reversed_=False):
    return {
        "id": qid, "qnum": qnum, "section": section, "text": text,
        "type": "likert", "max_points": 2,
        "options": LIKERT_REVERSED if reversed_ else LIKERT_OPTIONS,
    }


def frequency(qid, qnum, text, section):
    return {
        "id": qid, "qnum": qnum, "section": section, "text": text,
        "type": "multiple_choice", "max_points": 2, "options": FREQUENCY_STANDARD,
    }


def multi_select(qid, qnum, text, options, section, points_each=0.5):
    return {
        "id": qid, "qnum": qnum, "section": section, "text": text,
        "type": "multi_select", "max_points": points_each * len(options),
        "options": [{"label": o, "points": points_each} for o in options],
    }


def multi_select_departments(qid, qnum, text, section, extra_stakeholders=None):
    stakeholders = DEPARTMENTS_4 + (extra_stakeholders or [])
    return multi_select(qid, qnum, text, stakeholders, section)


QUESTIONS = [
    # ============ SECTION 1: Data, Documentation and Communication ============
    {
        "id": "q1", "qnum": "1", "section": SECTION_DATA,
        "text": "When does your organization check the suitability of the data for the purpose of the system?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "In every iteration", "points": 2},
            {"label": "In the beginning", "points": 1},
            {"label": "Once in a while", "points": 0},
            {"label": "This has never happened", "points": 0},
        ],
    },
    frequency("q2", "2", "How often does your organization adjust the data when it is not representative for the purpose of the system?", SECTION_DATA),
    frequency("q3", "3", "How often does your organization adjust the data when it is found to contain errors?", SECTION_DATA),
    {
        "id": "q4", "qnum": "4", "section": SECTION_DATA,
        "text": "Has your organization noticed risks in the dataset in the past 2 years?",
        "type": "boolean", "max_points": 2,
        "options": [{"label": "Yes", "points": 2}, {"label": "No", "points": 0}],
    },
    frequency("q5", "5", "How often has your organisation mitigated risks for your dataset?", SECTION_DATA),
    {
        "id": "q6", "qnum": "6", "section": SECTION_DATA,
        "text": "Where in the data gathering phase are actions taken to mitigate risks concerning the dataset?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "During every step of the process", "points": 2},
            {"label": "Before gathering the data", "points": 1},
            {"label": "During data gathering", "points": 1},
            {"label": "After the dataset is gathered", "points": 0},
            {"label": "Risks are not mitigated", "points": 0},
        ],
    },
    {
        "id": "q7", "qnum": "7", "section": SECTION_DATA,
        "text": "Does your organization have an employee trained on data and model bias?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "Yes, both data and model bias", "points": 2},
            {"label": "Only on data bias", "points": 1},
            {"label": "Only on model bias", "points": 1},
            {"label": "No", "points": 0},
        ],
    },
    likert("q8", "8", "People in my organization are aware that bias can occur in data.", SECTION_DATA),
    likert("q9", "9", "People in my organization are aware that bias can occur in the model.", SECTION_DATA),
    {
        "id": "q10", "qnum": "10", "section": SECTION_DATA,
        "text": "Is your organization aware of its customer demographic?",
        "type": "boolean", "max_points": 2,
        "options": [{"label": "Yes", "points": 2}, {"label": "No", "points": 0}],
    },
    frequency("q11", "11", "How often is model performance tested per demographic?", SECTION_DATA),
    frequency("q12", "12", "How often are performance test results for demographics communicated with stakeholders?", SECTION_DATA),
    frequency("q13", "13", "How often does it come out that a dataset misses data?", SECTION_DATA),
    likert("q14", "14", "There is a protocol that must be followed if it comes out that the dataset misses data.", SECTION_DATA),
    {
        "id": "q15", "qnum": "15", "section": SECTION_DATA,
        "text": "How often does your organization have discussions around the internally accepted level of what a good accuracy is?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "For every model", "points": 2},
            {"label": "Around every quarter of the year", "points": 2},
            {"label": "Once a year", "points": 1},
            {"label": "This has never happened", "points": 0},
        ],
    },
    likert("q16", "16", "Technical documentation is very detailed within my organization.", SECTION_DATA),
    likert("q17", "17", "Technical documentation is shared with the management of my organization.", SECTION_DATA),
    likert("q18", "18", "Technical documentation of my organization is written for technical people only.", SECTION_DATA, reversed_=True),
    likert("q19", "19", "Technical documentation from one department can be understood by another department in my organization.", SECTION_DATA),
    likert("q20", "20", "There are guidelines within my organization to ensure completeness of technical documentation.", SECTION_DATA),
    frequency("q21", "21", "How often are compliance requirements in relation to documentation communicated with the development chain?", SECTION_DATA),
    {
        "id": "q22", "qnum": "22", "section": SECTION_DATA,
        "text": "Is someone in your organization trained to determine the compliance requirements of the documentation?",
        "type": "boolean", "max_points": 2,
        "options": [{"label": "Yes", "points": 2}, {"label": "No", "points": 0}],
    },
    {
        "id": "q23", "qnum": "23", "section": SECTION_DATA,
        "text": "How often are guidelines for technical documentation revised?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "During every project", "points": 2},
            {"label": "A few times a year", "points": 2},
            {"label": "Once a year", "points": 1},
            {"label": "Less than once a year", "points": 0},
            {"label": "Never after they were created", "points": 0},
            {"label": "We don't use guidelines", "points": 0},
        ],
    },
    multi_select_departments("q24", "24", "To whom does your organization communicate accepted risks of the system?", SECTION_DATA, extra_stakeholders=["The user"]),
    likert("q25", "25", "My organization communicates accepted risks of the system with the user.", SECTION_DATA),
    {
        "id": "q26", "qnum": "26", "section": SECTION_DATA,
        "text": "How does your organization estimate a model's risk on rights and discrimination?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "We have fixed metrics", "points": 2},
            {"label": "Metrics can vary case by case", "points": 2},
            {"label": "We are figuring out the metrics", "points": 1},
            {"label": "We don't estimate this risk", "points": 0},
        ],
    },
    frequency("q27", "27", "How often do you measure a model's risk on rights and discrimination?", SECTION_DATA),
    frequency("q28", "28", "How often does your organization test that the user of the system understands what the model is predicting?", SECTION_DATA),

    # ============ SECTION 2: Model Risk (Monitoring, QA, Risk Management) ============
    multi_select("q29", "29", "What type of qualifications do the people that are monitoring the running systems have?",
                 ["A degree in that field", "A technical background", "Part of a technical focused background"],
                 SECTION_RISK),
    likert("q30", "30", "My organization has put someone in charge of monitoring the systems with appropriate qualifications.", SECTION_RISK),
    frequency("q31", "31", "How often is it checked post-monitoring if model requirements are still met?", SECTION_RISK),
    likert("q32", "32", "Models of my organization that learn after placement are guided to ensure that the model still meets requirements.", SECTION_RISK),
    likert("q33", "33", "My organization has clear quality standards to which a system must adhere.", SECTION_RISK),
    likert("q34", "34", "My organization assesses functional completeness, correctness and appropriateness.", SECTION_RISK),
    {
        "id": "q35", "qnum": "35", "section": SECTION_RISK,
        "text": "My organization has established a risk management system.",
        "type": "boolean", "max_points": 2,
        "options": [{"label": "Yes", "points": 2}, {"label": "No", "points": 0}],
    },
    multi_select_departments("q36", "36", "Which departments are involved in the risk management system?", SECTION_RISK),
    likert("q37", "37", "My organization assesses the risk management system frequently.", SECTION_RISK),
    {
        "id": "q38", "qnum": "38", "section": SECTION_RISK,
        "text": "How often do you test that an action has mitigated the risk?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "For almost every adjustment", "points": 2},
            {"label": "For about half of the adjustments", "points": 1},
            {"label": "For only a small percentage", "points": 0},
            {"label": "No adjustments are tested for mitigation", "points": 0},
        ],
    },
    {
        "id": "q39", "qnum": "39", "section": SECTION_RISK,
        "text": "How often are flagged risks actually mitigated?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "All high and medium impact risks are mitigated", "points": 2},
            {"label": "About half of the flagged high risks are mitigated", "points": 1},
            {"label": "All flagged risks are mitigated", "points": 0},
            {"label": "No flagged risks are mitigated", "points": 0},
            {"label": "Risks are never flagged for our models", "points": 0},
        ],
    },
    likert("q40", "40", "My organization coordinates risk mitigation throughout the entire chain of development.", SECTION_RISK),
    frequency("q41", "41", "How often are risks of the system communicated across stakeholders?", SECTION_RISK),
    likert("q42", "42", "My organization communicates risks of the system across stakeholders.", SECTION_RISK),

    # ============ SECTION 3: Development Lifecycle ============
    multi_select("q43", "43", "How does your organization ensure that technical decisions align with business objectives?",
                 ["Regular meetings between technical and business teams", "Detailed technical requirements documentation",
                  "Strong project management processes", "Built-in check-ins with business teams during development"],
                 SECTION_LIFECYCLE),
    likert("q44", "44", "Within my organization it is defined who is developing which code.", SECTION_LIFECYCLE),
    {
        "id": "q45", "qnum": "45", "section": SECTION_LIFECYCLE,
        "text": "Are departments that are involved in the process of creating the AI-system trained for compliance?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "Yes, all involved departments are trained", "points": 2},
            {"label": "Only a part of the involved departments are trained on compliance", "points": 2},
            {"label": "There is a separate department trained for compliance that's not really involved", "points": 1},
            {"label": "No, there is no one involved who is trained for compliance", "points": 0},
        ],
    },
    likert("q46", "46", "My organization has a protocol that must be followed if a developer finds bias or a red flag in the model.", SECTION_LIFECYCLE),
    likert("q47", "47", "My organization has a protocol that must be followed if the model monitoring shows an error in the system.", SECTION_LIFECYCLE),
    {
        "id": "q48", "qnum": "48", "section": SECTION_LIFECYCLE,
        "text": "What actions are taken when the data used to train the model becomes outdated?",
        "type": "multiple_choice", "max_points": 2,
        "options": [
            {"label": "The model is retrained with new data", "points": 2},
            {"label": "The model is replaced with a new model on current data", "points": 2},
            {"label": "This problem has never occurred to us", "points": 0},
        ],
    },
    likert("q49", "49", "My organization has a protocol that must be followed if the model data is outdated after running for a while.", SECTION_LIFECYCLE),
    likert("q50", "50", "My organization communicates data gaps with stakeholders of the project.", SECTION_LIFECYCLE),
]