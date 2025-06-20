'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/configs';
import { userResponses } from '@/configs/Schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function page(){
  const { formId } = useParams();
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
 const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formId));
      const parsed = result.map(item => ({ ...JSON.parse(item.jsonResponse), userId: item.userId }));
      setData(parsed);
      setFields(Object.keys(parsed?.[0] || {}));
      setLoading(false);
    };
    fetchResponses();
  }, [formId]);

  if (loading) return <p className="p-4">Loading...</p>;

  const totalResponses = data.length;
  const users = [...new Set(data.map(d => d.userId))];

const generateSummary = async () => {
  const prompt =  `
You are a data analyst. I will provide you with form response data.
Please analyze the data and return a JSON object with this structure:

{
  "keyInsights": [ "insight 1", "insight 2", ... ],
  "summaryStatistics": { "stat1": "value", "stat2": "value", ... },
  "possibleRecommendations": [ "recommendation 1", "recommendation 2", ... ]
}

Do not include any explanation text or markdown — just return valid JSON.

Here is the response data:
${JSON.stringify(data).slice(0, 8000)}
`;

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: {
          text: prompt,
        },
      },
    ],
  });

 const text = await result.response.text();

try {
  
  const cleaned = text
    .replace(/```json/i, '')
    .replace(/```/g, '')
    .trim();

  const json = JSON.parse(cleaned);
  setAiSummary(json);
} catch (e) {
  console.error("AI response was not valid JSON:", text);
  setAiSummary({ error: "Invalid AI response. Please try again." });
}
};


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics for Form : {name}</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Total Responses</p>
          <p className="text-2xl font-semibold">{totalResponses}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Unique Users</p>
          <p className="text-2xl font-semibold">{users.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Field Distributions</h2>
        {fields.map(field => {
          const fieldData = data.reduce((acc, item) => {
            const value = item[field] || 'N/A';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
          }, {});
          const chartData = Object.entries(fieldData).map(([key, value]) => ({
            name: key,
            count: value
          }));
          return (
            <div key={field} className="my-4">
              <h3 className="font-medium mb-2">{field}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">User List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
            <tr>
    <th className="px-4 py-2 border">S. No.</th>
    {fields.map(f => (
      <th key={f} className="px-4 py-2 border">{f}</th>
    ))}
  </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t">
            <td className="px-4 py-2 border">{i + 1}</td>

                  {fields.map(f => (
                    <td key={f} className="px-4 py-2 border">{String(row[f] || '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
         {aiSummary && !aiSummary.error && (
  <div className="mt-6 space-y-4 bg-gray-50 p-4 border rounded">
    <h2 className="text-xl font-bold">Key Insights</h2>
    <ul className="list-disc ml-6 text-gray-800">
      {aiSummary.keyInsights?.map((insight, idx) => (
        <li key={idx}>{insight}</li>
      ))}
    </ul>

    <h2 className="text-xl font-bold mt-4">Summary Statistics</h2>
    <div className="space-y-1">
      {Object.entries(aiSummary.summaryStatistics || {}).map(([key, val], idx) => (
        <p key={idx}><strong>{key}:</strong> {val}</p>
      ))}
    </div>

    <h2 className="text-xl font-bold mt-4">Possible Recommendations</h2>
    <ul className="list-decimal ml-6 text-gray-800">
      {aiSummary.possibleRecommendations?.map((rec, idx) => (
        <li key={idx}>{rec}</li>
      ))}
    </ul>
  </div>
)}

{aiSummary.error && (
  <p className="text-red-500">{aiSummary.error}</p>
)}

        <button
          className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={generateSummary}
        >
          Generate AI Summary
        </button>
    
      </div>
    </div>
  );
}
export default page