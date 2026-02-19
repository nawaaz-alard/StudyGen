
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LifeScienceQuiz from '../LifeScience/LifeScienceQuiz'
import MathQuiz from '../Math/MathQuiz'
import AfrikaansQuiz from '../Afrikaans/AfrikaansQuiz'
import { MOCK_CONTENT } from '../../data/mockData';

export default function ModuleView() {
    const { id } = useParams()

    if (id === 'lifescience') {
        return <LifeScienceQuiz />
    }
    if (id === 'math') {
        return <MathQuiz />
    }
    if (id === 'afrikaans') {
        return <AfrikaansQuiz />
    }


    const [content, setContent] = useState<any>(null)

    useEffect(() => {
        setContent(null); // Reset content on id change

        fetch(`/api/getContent?moduleId=${id}`)
            .then(res => {
                const contentType = res.headers.get("content-type");
                if (res.ok && contentType && contentType.includes("application/json")) {
                    return res.json();
                }
                throw new Error("API not available (likely dev mode)");
            })
            .then(data => setContent(data))
            .catch(err => {
                console.warn("API Fetch Failed - using Mock Content", err);
                // Fallback to mock content if available
                if (id && MOCK_CONTENT[id]) {
                    setTimeout(() => setContent(MOCK_CONTENT[id]), 500); // Simulate network delay
                } else {
                    setContent({ sections: [{ title: "Error", content: "Content failed to load." }] });
                }
            })
    }, [id])

    return (
        <div className="page-padding">
            <Link to="/" className="back-link">
                ← Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass view-container"
            >
                <h1 className="mb-2">{id?.toUpperCase()} Module</h1>

                {content ? (
                    <div>
                        <p>Content loaded securely from Consolidated API/Datastore.</p>
                        <div className="mt-2 grid-gap-2">
                            {content.sections?.map((section: any, idx: number) => (
                                <div key={idx} className="section-card">
                                    <h3 className="section-title">{section.title}</h3>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="spinner-container">
                        <div className="animate-spin spinner"></div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
