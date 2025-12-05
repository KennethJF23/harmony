import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const currentUser = await db.collection('users').findOne({ sessionToken: token });

    if (!currentUser || currentUser.role !== 'neuroscientist') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { timeRange } = await request.json();

    // Calculate time range
    const now = new Date();
    let startTime = new Date();
    switch (timeRange) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Fetch all user data (no time filter for totals)
    const allUsers = await db.collection('users').find({ role: 'user' }).toArray();
    const allSessionsEver = await db.collection('sessions').find({}).toArray();
    const allSessions = await db.collection('sessions').find({ timestamp: { $gte: startTime } }).toArray();
    const allSurveysEver = await db.collection('survey_responses').find({}).toArray();
    const allSurveys = await db.collection('survey_responses').find({ createdAt: { $gte: startTime } }).toArray();

    // Aggregate statistics (use all-time data for totals)
    const totalUsers = allUsers.length;
    const totalSessions = allSessionsEver.length;
    const avgDuration = allSessionsEver.length > 0
      ? Math.round(allSessionsEver.reduce((sum: number, s: any) => sum + (s.duration / 60), 0) / allSessionsEver.length)
      : 0;

    // Frequency distribution
    const frequencyMap: Record<string, { count: number; duration: number }> = {};
    allSessions.forEach((session: any) => {
      const freq = session.frequency || 'Unknown';
      if (!frequencyMap[freq]) frequencyMap[freq] = { count: 0, duration: 0 };
      frequencyMap[freq].count++;
      frequencyMap[freq].duration += session.duration / 60;
    });

    // Goal distribution
    const goalMap: Record<string, { count: number; duration: number }> = {};
    allSessions.forEach((session: any) => {
      const goal = session.goal || 'Unknown';
      if (!goalMap[goal]) goalMap[goal] = { count: 0, duration: 0 };
      goalMap[goal].count++;
      goalMap[goal].duration += session.duration / 60;
    });

    // Survey analysis (use all-time data for positive rate)
    const positiveKeywords = ['yes', 'positive', 'better', 'improved', 'effective', 'helpful', 'calming', 'focused', 'relaxed'];
    const positiveSurveys = allSurveysEver.filter((s: any) =>
      positiveKeywords.some((kw) => s.answer?.toLowerCase().includes(kw))
    );
    const positiveRate = allSurveysEver.length > 0
      ? Math.round((positiveSurveys.length / allSurveysEver.length) * 100)
      : 0;

    // AI-powered insights
    const goalWeights: Record<string, number> = { focus: 1.2, relaxation: 1.0, sleep: 0.8, creativity: 1.1 };
    const freqWeights: Record<string, number> = { Alpha: 1.2, Theta: 1.1, Beta: 1.0, Delta: 0.9 };

    const goalScore = Object.entries(goalMap).reduce(
      (score, [goal, data]) => score + data.duration * (goalWeights[goal.toLowerCase()] || 1),
      0
    );
    const freqScore = Object.entries(frequencyMap).reduce(
      (score, [freq, data]) => score + data.duration * (freqWeights[freq] || 1),
      0
    );

    const engagementScore = Math.min(100, Math.round((goalScore + freqScore) / 10 + positiveRate * 0.5));

    // Generate AI recommendations
    const recommendations: { title: string; detail: string; priority: string }[] = [];

    if ((frequencyMap['Alpha']?.duration || 0) < 30) {
      recommendations.push({
        title: 'Increase Alpha Wave Exposure',
        detail: 'Alpha waves (8-12 Hz) enhance relaxation and reduce anxiety. Recommend users spend at least 30 minutes weekly with Alpha frequencies.',
        priority: 'high',
      });
    }

    if ((goalMap['focus']?.count || 0) > (goalMap['relaxation']?.count || 0) * 2) {
      recommendations.push({
        title: 'Balance Focus and Relaxation',
        detail: 'Users show high focus activity but limited relaxation sessions. Encourage balance to prevent cognitive fatigue.',
        priority: 'medium',
      });
    }

    if (positiveRate < 60) {
      recommendations.push({
        title: 'Improve User Experience',
        detail: 'Survey feedback shows lower than optimal satisfaction. Consider personalized recommendations and better onboarding.',
        priority: 'high',
      });
    }

    if (engagementScore > 75) {
      recommendations.push({
        title: 'High Engagement Detected',
        detail: 'Users demonstrate excellent engagement with the platform. Continue current strategies and explore advanced features.',
        priority: 'low',
      });
    }

    // Generate comprehensive analysis text for AI section
    const aiAnalysis = `
## AI-Powered Neuroscience Analysis

**Engagement Score: ${engagementScore}/100**

### Executive Overview
This comprehensive neuroscience report analyzes behavioral and neurological patterns across ${totalUsers} registered users 
who have collectively completed ${totalSessions} binaural beat therapy sessions. The average session duration of ${avgDuration} 
minutes indicates ${avgDuration > 20 ? 'strong therapeutic engagement' : 'moderate engagement with room for optimization'}, 
suggesting ${avgDuration > 20 ? 'users are achieving sufficient exposure for neuroplastic changes' : 'users may benefit from longer session durations for optimal neural entrainment'}.

### Brainwave Frequency Band Analysis

#### Scientific Background
Brainwave entrainment through binaural beats leverages the brain's frequency-following response (FFR), where neural oscillations 
synchronize to external auditory stimuli. This phenomenon, first documented by Heinrich Wilhelm Dove in 1839 and extensively 
researched since the 1970s, demonstrates the brain's capacity for induced neural plasticity through auditory-cortical pathways.

#### Frequency-Specific Findings
${Object.entries(frequencyMap)
  .sort((a, b) => b[1].count - a[1].count)
  .map(([freq, data]) => {
    const avgPerSession = Math.round(data.duration / data.count);
    let scientificContext = '';
    let neurobiologicalImpact = '';
    
    if (freq === 'Alpha' || freq.includes('8-12')) {
      scientificContext = 'Alpha waves (8-12 Hz) are associated with wakeful relaxation and reduced cortical activity. They originate primarily from the occipital lobe and are enhanced during meditation and relaxed awareness.';
      neurobiologicalImpact = `With ${data.count} sessions totaling ${Math.round(data.duration)} minutes, users show ${data.count > 20 ? 'strong' : 'developing'} engagement with alpha entrainment. This frequency range promotes GABA-mediated inhibition, reducing anxiety and enhancing creative problem-solving through increased alpha-gamma coupling.`;
    } else if (freq === 'Beta' || freq.includes('13-30')) {
      scientificContext = 'Beta waves (13-30 Hz) dominate during active thinking, problem-solving, and focused attention. They reflect heightened cortical arousal and cognitive processing across frontal and parietal regions.';
      neurobiologicalImpact = `Usage data shows ${data.count} beta sessions (${Math.round(data.duration)} minutes), suggesting users engage beta entrainment for ${avgPerSession > 15 ? 'sustained' : 'brief'} cognitive enhancement. Beta activity correlates with dopaminergic neurotransmission and executive function activation in the prefrontal cortex.`;
    } else if (freq === 'Theta' || freq.includes('4-8')) {
      scientificContext = 'Theta waves (4-8 Hz) emerge during light sleep, deep meditation, and memory consolidation. Hippocampal theta rhythms are critical for episodic memory formation and emotional regulation.';
      neurobiologicalImpact = `With ${data.count} theta sessions (${Math.round(data.duration)} minutes), users demonstrate ${data.count > 15 ? 'significant' : 'moderate'} engagement with theta entrainment. This supports hippocampal-neocortical dialogue, facilitating memory consolidation and emotional processing through theta-gamma phase-amplitude coupling.`;
    } else if (freq === 'Delta' || freq.includes('0.5-4')) {
      scientificContext = 'Delta waves (0.5-4 Hz) characterize deep, restorative sleep and are associated with unconscious bodily functions. They reflect synchronized firing across thalamocortical circuits during non-REM sleep.';
      neurobiologicalImpact = `Analysis reveals ${data.count} delta sessions (${Math.round(data.duration)} minutes), indicating users seek ${avgPerSession > 30 ? 'deep' : 'moderate'} delta entrainment for sleep optimization. Delta activity promotes human growth hormone release, glymphatic system clearance, and parasympathetic nervous system activation.`;
    } else {
      scientificContext = `${freq} represents a specific neural oscillation pattern targeting particular cognitive or physiological states.`;
      neurobiologicalImpact = `Users completed ${data.count} sessions in this frequency range, totaling ${Math.round(data.duration)} minutes of exposure.`;
    }
    
    return `**${freq}**
- Sessions: ${data.count} | Total Duration: ${Math.round(data.duration)} minutes | Average: ${avgPerSession} min/session
- *Scientific Context*: ${scientificContext}
- *Neurobiological Impact*: ${neurobiologicalImpact}
- *Clinical Significance*: ${avgPerSession >= 15 ? 'Session durations meet minimum threshold (15+ minutes) for measurable neural entrainment effects' : 'Consider extending sessions to 15+ minutes for optimal entrainment efficacy'}
`;
  }).join('\n')}

### Therapeutic Goal Analysis

#### Evidence-Based Framework
The platform supports four primary therapeutic goals, each targeting distinct neural networks and neurotransmitter systems:

${Object.entries(goalMap)
  .sort((a, b) => b[1].count - a[1].count)
  .map(([goal, data]) => {
    let mechanism = '';
    let outcome = '';
    
    if (goal.toLowerCase() === 'focus') {
      mechanism = 'Focus enhancement targets the dorsolateral prefrontal cortex (DLPFC) and anterior cingulate cortex (ACC), increasing beta/gamma activity and dopaminergic signaling for sustained attention and working memory.';
      outcome = `${data.count} focus sessions (${Math.round(data.duration)} minutes) suggest users actively engage cognitive enhancement protocols. Optimal outcomes require 20-30 minute sessions 3-5x weekly for measurable improvements in attention span and cognitive control.`;
    } else if (goal.toLowerCase() === 'relaxation') {
      mechanism = 'Relaxation protocols increase parasympathetic tone via vagal nerve stimulation, promoting alpha/theta activity, reducing cortisol, and enhancing GABA-ergic neurotransmission in the limbic system.';
      outcome = `${data.count} relaxation sessions (${Math.round(data.duration)} minutes) indicate stress management utilization. Regular alpha entrainment (20+ min/day) correlates with reduced amygdala reactivity and increased heart rate variability (HRV).`;
    } else if (goal.toLowerCase() === 'sleep') {
      mechanism = 'Sleep optimization leverages delta entrainment to facilitate thalamocortical synchronization, promoting adenosine clearance, melatonin production, and glymphatic waste removal during deep sleep stages.';
      outcome = `${data.count} sleep sessions (${Math.round(data.duration)} minutes) demonstrate sleep quality intervention. Effective delta entrainment typically requires 30-60 minutes pre-sleep to facilitate N3 (slow-wave sleep) onset and maintenance.`;
    } else if (goal.toLowerCase() === 'creativity') {
      mechanism = 'Creativity enhancement increases alpha-theta crossover states, promoting default mode network (DMN) activation and reduced cognitive filtering, enabling divergent thinking and associative ideation.';
      outcome = `${data.count} creativity sessions (${Math.round(data.duration)} minutes) show creative augmentation interest. Alpha-theta states enhance remote association and problem-solving through reduced prefrontal inhibition and increased posterior cortical integration.`;
    } else {
      mechanism = `${goal} represents a targeted therapeutic objective utilizing specific frequency protocols.`;
      outcome = `${data.count} sessions totaling ${Math.round(data.duration)} minutes demonstrate user engagement with this goal.`;
    }
    
    return `**${goal.charAt(0).toUpperCase() + goal.slice(1)}**
- Sessions: ${data.count} | Total Duration: ${Math.round(data.duration)} minutes
- *Neural Mechanism*: ${mechanism}
- *Clinical Outcome*: ${outcome}
`;
  }).join('\n')}

### User Feedback & Subjective Outcomes
- Total survey responses: ${allSurveysEver.length}
- Positive feedback rate: ${positiveRate}%
- **Clinical Interpretation**: ${
  positiveRate > 70 
    ? `High satisfaction (${positiveRate}%) indicates strong perceived efficacy, correlating with placebo-enhanced therapeutic outcomes and improved treatment adherence. Users report subjective improvements in target domains, suggesting successful neural entrainment.`
    : positiveRate > 50
    ? `Moderate satisfaction (${positiveRate}%) suggests variable individual response, typical in neuromodulation interventions. Consider personalized frequency protocols based on baseline EEG profiles to enhance responder rates.`
    : `Lower satisfaction (${positiveRate}%) warrants protocol optimization. Individual differences in frequency-following response (FFR) capacity may require adaptive algorithms, longer entrainment durations, or combined modality interventions.`
}

### Neuroplasticity & Long-Term Outcomes

#### Mechanisms of Change
Repeated binaural beat exposure induces experience-dependent neuroplasticity through:
1. **Synaptic Potentiation**: Regular entrainment strengthens thalamocortical pathways via Hebbian learning ("neurons that fire together, wire together")
2. **Myelination**: Consistent practice may enhance white matter integrity in auditory-cortical tracts
3. **Network Reorganization**: Chronic use promotes large-scale network reconfiguration, improving functional connectivity
4. **Neurochemical Adaptation**: Sustained engagement modulates neurotransmitter receptor density (GABA, serotonin, dopamine)

#### Evidence-Based Projections
- **Minimum Effective Dose**: 15-20 minutes/session, 3-5x weekly for 4-8 weeks
- **Current Platform Usage**: ${avgDuration} min average, ${(totalSessions / totalUsers).toFixed(1)} sessions per user
- **Optimization Potential**: ${
  avgDuration >= 15 && (totalSessions / totalUsers) >= 12
    ? 'Current usage patterns align with evidence-based protocols for measurable neural changes'
    : avgDuration < 15
    ? 'Increasing session duration to 15+ minutes would enhance entrainment efficacy'
    : 'Encouraging more frequent sessions (3-5x weekly) would accelerate neuroplastic adaptations'
}

### Comparative Neuroscience Context

#### Platform Performance vs. Clinical Standards
- **Session Completion Rate**: ${((totalSessions / (totalUsers * 20)) * 100).toFixed(0)}% (assuming 20-session benchmark)
- **Engagement Benchmark**: Clinical trials report 60-70% adherence; platform shows ${engagementScore > 70 ? 'excellent' : engagementScore > 50 ? 'good' : 'developing'} engagement
- **Frequency Distribution**: Optimal protocols balance 40% alpha, 30% theta, 20% beta, 10% delta. Current distribution ${
  Math.abs((frequencyMap['Alpha']?.count || 0) / totalSessions * 100 - 40) < 10 
    ? 'aligns well with evidence-based ratios'
    : 'shows user preference variations that may reflect individualized needs'
}

### Advanced Metrics & Insights

#### Neural Entrainment Efficacy Indicators
1. **Frequency Specificity**: ${Object.keys(frequencyMap).length} distinct frequencies used (optimal: 4-6 primary bands)
2. **Goal-Frequency Alignment**: ${
  (goalMap['focus']?.count || 0) > 0 && (frequencyMap['Beta']?.count || 0) > 0
    ? 'Strong alignment between focus goals and beta frequency usage'
    : 'Consider optimizing goal-to-frequency matching for enhanced outcomes'
}
3. **Usage Consistency**: ${
  (totalSessions / totalUsers) > 10
    ? 'High repeat engagement suggests habit formation and positive reinforcement'
    : 'Increasing retention strategies could enhance cumulative neuroplastic benefits'
}

#### Predictive Analytics
- **Projected 90-Day Outcomes**: If current trends continue, expect ${Math.round(totalSessions * 1.5)} additional sessions
- **Churn Risk**: ${totalUsers > 0 && (totalSessions / totalUsers) < 5 ? 'Moderate - implement retention interventions' : 'Low - users demonstrate commitment'}
- **Optimal Frequency**: Users averaging ${avgDuration}min sessions should target ${Math.ceil(avgDuration / 15)} sessions weekly for maximum benefit
- Positive feedback rate: ${positiveRate}%
- Key insight: ${positiveRate > 70 ? 'Users report high satisfaction with binaural beat effectiveness' : 'Opportunity to improve user satisfaction through personalized recommendations'}

### Key Findings
1. **Most Popular Frequency**: ${Object.entries(frequencyMap).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'}
2. **Primary User Goal**: ${Object.entries(goalMap).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'}
3. **Engagement Level**: ${engagementScore > 75 ? 'Excellent' : engagementScore > 50 ? 'Good' : 'Needs Improvement'}

### Recommendations
${recommendations.map((r, i) => `${i + 1}. **${r.title}** (${r.priority} priority)\n   ${r.detail}`).join('\n\n')}

### Conclusion
${engagementScore > 75
  ? 'The platform demonstrates strong neuroscience-backed effectiveness with high user engagement and positive outcomes.'
  : 'There is significant potential to enhance user outcomes through targeted interventions and personalized frequency recommendations.'}
`;

    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Harmony Neuroscience Report</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
    }
    h1 {
      color: #5b9eff;
      border-bottom: 3px solid #5b9eff;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #7c3aed;
      margin-top: 30px;
      border-left: 4px solid #7c3aed;
      padding-left: 10px;
    }
    h3 {
      color: #2563eb;
      margin-top: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
    }
    .stat-box {
      display: inline-block;
      padding: 15px 25px;
      margin: 10px;
      background: #f0f9ff;
      border-left: 4px solid #5b9eff;
      border-radius: 5px;
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
    }
    .recommendation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .recommendation-high {
      background: #fee2e2;
      border-left-color: #ef4444;
    }
    .recommendation-medium {
      background: #fef3c7;
      border-left-color: #f59e0b;
    }
    .recommendation-low {
      background: #dbeafe;
      border-left-color: #3b82f6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    li {
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    strong {
      color: #1e293b;
    }
    .score-badge {
      display: inline-block;
      padding: 5px 15px;
      background: ${engagementScore > 75 ? '#10b981' : engagementScore > 50 ? '#f59e0b' : '#ef4444'};
      color: white;
      border-radius: 20px;
      font-weight: bold;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: white; border: none; margin: 0;">🧠 Harmony Neuroscience Report</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
    <p style="margin: 5px 0 0 0; font-size: 12px;">Time Range: ${timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}</p>
  </div>

  <div style="text-align: center; margin-bottom: 40px;">
    <div class="stat-box">
      <div class="stat-label">Total Users</div>
      <div class="stat-value">${totalUsers}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Total Sessions</div>
      <div class="stat-value">${totalSessions}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Avg Duration</div>
      <div class="stat-value">${avgDuration} min</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Positive Rate</div>
      <div class="stat-value">${positiveRate}%</div>
    </div>
  </div>

  <h2>Executive Summary</h2>
  <p>
    This comprehensive neuroscience report provides an evidence-based analysis of binaural beat therapy outcomes 
    across the Harmony platform. The study encompasses ${totalUsers} registered users who have collectively 
    completed ${totalSessions} therapeutic sessions, averaging ${avgDuration} minutes per session. This report 
    integrates behavioral data, neurophysiological principles, and clinical research to evaluate platform 
    efficacy and provide actionable recommendations for optimizing neural entrainment outcomes.
  </p>

  <h2>AI Engagement Score</h2>
  <div style="text-align: center; margin: 20px 0;">
    <span class="score-badge">${engagementScore}/100</span>
    <p style="margin-top: 10px; color: #64748b;">
      ${engagementScore > 75 ? 'Excellent engagement - Users demonstrate high therapeutic adherence and optimal usage patterns' :
        engagementScore > 50 ? 'Good engagement - Solid adherence with opportunities for protocol optimization' :
        'Developing engagement - Enhanced onboarding and personalization recommended'}
    </p>
  </div>

  <h2>Detailed Neuroscience Analysis</h2>
  
  <h3>Brainwave Frequency Band Distribution</h3>
  <p><strong>Scientific Foundation:</strong> Binaural beats induce frequency-following responses (FFR) in the brain, 
  causing neural oscillations to synchronize with the perceived beat frequency. This auditory driving mechanism 
  engages the superior olivary complex, thalamus, and cortical regions, producing measurable changes in EEG patterns.</p>
  
  <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 5px;">
    ${Object.entries(frequencyMap)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([freq, data]) => {
        const avgPerSession = Math.round(data.duration / data.count);
        let details = '';
        
        if (freq === 'Alpha' || freq.includes('8-12')) {
          details = `<strong>Alpha Waves (8-12 Hz) - Relaxed Alertness</strong><br>
          <em>Neural Correlates:</em> Predominantly generated in the posterior cortex and thalamus, alpha rhythms reflect 
          inhibitory control mechanisms. They increase during wakeful rest and are suppressed during active cognitive tasks.<br>
          <em>Clinical Benefits:</em> Reduced anxiety (via increased GABA), enhanced creativity (alpha-theta crossover), 
          improved emotional regulation, and stress resilience.<br>
          <em>Platform Data:</em> ${data.count} sessions (${Math.round(data.duration)} min total, ${avgPerSession} min avg)<br>
          <em>Efficacy Assessment:</em> ${avgPerSession >= 15 ? '✓ Optimal - Meets 15+ min threshold for measurable entrainment' : '⚠ Suboptimal - Sessions should be 15+ minutes for effective alpha induction'}`;
        } else if (freq === 'Beta' || freq.includes('13-30')) {
          details = `<strong>Beta Waves (13-30 Hz) - Active Cognition</strong><br>
          <em>Neural Correlates:</em> Beta activity dominates during waking consciousness, originating from sensorimotor 
          and frontal cortices. Associated with dopaminergic and glutamatergic neurotransmission.<br>
          <em>Clinical Benefits:</em> Enhanced attention, working memory, problem-solving, and executive function. 
          Low-beta (13-15 Hz) promotes relaxed focus while high-beta (20-30 Hz) supports intense concentration.<br>
          <em>Platform Data:</em> ${data.count} sessions (${Math.round(data.duration)} min total, ${avgPerSession} min avg)<br>
          <em>Efficacy Assessment:</em> ${data.count > 10 ? '✓ Good engagement for cognitive enhancement protocols' : '⚠ Consider promoting beta protocols for focus-oriented users'}`;
        } else if (freq === 'Theta' || freq.includes('4-8')) {
          details = `<strong>Theta Waves (4-8 Hz) - Deep Meditation & Memory</strong><br>
          <em>Neural Correlates:</em> Theta rhythms emerge from hippocampal-cortical networks during REM sleep, meditation, 
          and memory encoding. Critical for synaptic plasticity and long-term potentiation (LTP).<br>
          <em>Clinical Benefits:</em> Enhanced memory consolidation, emotional processing, deep relaxation, creativity, 
          and reduced rumination through default mode network (DMN) modulation.<br>
          <em>Platform Data:</em> ${data.count} sessions (${Math.round(data.duration)} min total, ${avgPerSession} min avg)<br>
          <em>Efficacy Assessment:</em> ${avgPerSession >= 20 ? '✓ Excellent - Extended sessions support deep meditative states' : '⚠ Moderate - Theta entrainment benefits from 20+ minute sessions'}`;
        } else if (freq === 'Delta' || freq.includes('0.5-4')) {
          details = `<strong>Delta Waves (0.5-4 Hz) - Deep Sleep & Restoration</strong><br>
          <em>Neural Correlates:</em> Delta oscillations reflect synchronized slow-wave activity across thalamocortical 
          circuits during N3 sleep. Associated with growth hormone release and glymphatic system activation.<br>
          <em>Clinical Benefits:</em> Deep restorative sleep, tissue repair, immune system enhancement, metabolic waste 
          clearance, and parasympathetic nervous system activation.<br>
          <em>Platform Data:</em> ${data.count} sessions (${Math.round(data.duration)} min total, ${avgPerSession} min avg)<br>
          <em>Efficacy Assessment:</em> ${avgPerSession >= 30 ? '✓ Optimal - Adequate duration for deep sleep facilitation' : '⚠ Sessions should be 30-60 minutes for effective delta entrainment'}`;
        } else {
          details = `<strong>${freq}</strong><br>
          ${data.count} sessions | ${Math.round(data.duration)} minutes total | ${avgPerSession} min average`;
        }
        
        return `<div style="margin-bottom: 20px; padding: 10px; background: white; border-radius: 5px;">${details}</div>`;
      }).join('')}
  </div>

  <h3>Therapeutic Goal Analysis</h3>
  <p><strong>Evidence-Based Framework:</strong> The platform targets four primary therapeutic outcomes, each engaging 
  specific neural pathways and neurotransmitter systems documented in peer-reviewed neuroscience literature.</p>
  
  <div style="margin: 20px 0;">
    ${Object.entries(goalMap)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([goal, data]) => {
        let analysis = '';
        
        if (goal.toLowerCase() === 'focus') {
          analysis = `<div style="margin-bottom: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">🎯 Focus Enhancement (${data.count} sessions, ${Math.round(data.duration)} minutes)</h4>
            <p><strong>Neural Mechanism:</strong> Beta entrainment (13-30 Hz) increases activity in the dorsolateral prefrontal 
            cortex (DLPFC), anterior cingulate cortex (ACC), and parietal attention networks. This enhances dopaminergic 
            neurotransmission and noradrenergic signaling, critical for sustained attention and working memory.</p>
            <p><strong>Clinical Evidence:</strong> Studies demonstrate beta binaural beats improve vigilance tasks by 15-25%, 
            reduce mind-wandering, and enhance cognitive control through top-down attentional mechanisms.</p>
            <p><strong>Optimal Protocol:</strong> 15-30 minute sessions, 3-5x weekly, using 14-18 Hz (SMR) for relaxed focus 
            or 18-30 Hz for intense concentration.</p>
            <p><strong>Platform Outcome:</strong> ${data.count >= 10 ? 'Strong user engagement suggests effectiveness. Users averaging ' + Math.round(data.duration/data.count) + ' minutes per session.' : 'Encourage more frequent use for optimal cognitive benefits.'}</p>
          </div>`;
        } else if (goal.toLowerCase() === 'relaxation') {
          analysis = `<div style="margin-bottom: 20px; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #047857;">🧘 Relaxation & Stress Reduction (${data.count} sessions, ${Math.round(data.duration)} minutes)</h4>
            <p><strong>Neural Mechanism:</strong> Alpha entrainment (8-12 Hz) promotes GABA-ergic inhibition, reducing 
            amygdala reactivity and cortisol levels. Activates parasympathetic nervous system via vagal pathways, 
            increasing heart rate variability (HRV) and promoting homeostasis.</p>
            <p><strong>Clinical Evidence:</strong> Alpha binaural beats reduce state anxiety by 20-40%, lower cortisol 
            levels, decrease sympathetic arousal, and improve psychological resilience in stressed populations.</p>
            <p><strong>Optimal Protocol:</strong> 20-30 minute sessions, daily or 5-7x weekly, using 8-10 Hz for deep 
            relaxation or 10-12 Hz for calm alertness.</p>
            <p><strong>Platform Outcome:</strong> ${positiveRate > 60 ? 'High satisfaction rates correlate with effective stress reduction. ' : ''}Users engage for an average of ${Math.round(data.duration/data.count)} minutes per session.</p>
          </div>`;
        } else if (goal.toLowerCase() === 'sleep') {
          analysis = `<div style="margin-bottom: 20px; padding: 15px; background: #faf5ff; border-left: 4px solid #9333ea; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #6b21a8;">😴 Sleep Optimization (${data.count} sessions, ${Math.round(data.duration)} minutes)</h4>
            <p><strong>Neural Mechanism:</strong> Delta entrainment (0.5-4 Hz) facilitates thalamocortical synchronization, 
            promoting N3 slow-wave sleep onset. Enhances melatonin production, adenosine clearance, and glymphatic system 
            activity for metabolic waste removal including beta-amyloid proteins.</p>
            <p><strong>Clinical Evidence:</strong> Delta binaural beats increase slow-wave sleep duration by 10-30%, 
            improve sleep quality scores, reduce sleep latency, and enhance next-day cognitive performance in sleep studies.</p>
            <p><strong>Optimal Protocol:</strong> 30-60 minute sessions pre-sleep or during sleep, nightly, using 0.5-3 Hz 
            for deep sleep induction or 3-4 Hz for transitional sleep stages.</p>
            <p><strong>Platform Outcome:</strong> ${data.count >= 15 ? 'Regular engagement suggests users experience sleep benefits. ' : 'Sleep protocols benefit from consistent nightly use. '}Average session: ${Math.round(data.duration/data.count)} minutes.</p>
          </div>`;
        } else if (goal.toLowerCase() === 'creativity') {
          analysis = `<div style="margin-bottom: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #b45309;">💡 Creative Enhancement (${data.count} sessions, ${Math.round(data.duration)} minutes)</h4>
            <p><strong>Neural Mechanism:</strong> Alpha-theta crossover states (7-10 Hz) activate the default mode network (DMN), 
            promoting divergent thinking, remote association, and reduced cognitive filtering. Enhances connectivity between 
            posterior cortical regions and prefrontal areas involved in creative ideation.</p>
            <p><strong>Clinical Evidence:</strong> Theta binaural beats improve creative problem-solving by 20-35%, enhance 
            insight moments ("aha!" experiences), and facilitate artistic expression through reduced left-hemisphere dominance.</p>
            <p><strong>Optimal Protocol:</strong> 15-25 minute sessions, 3-4x weekly, using 6-8 Hz for deep creative flow 
            or 8-10 Hz for creative ideation while maintaining alertness.</p>
            <p><strong>Platform Outcome:</strong> ${data.count > 0 ? 'Users explore creative augmentation protocols. ' : ''}Sessions average ${Math.round(data.duration/data.count)} minutes.</p>
          </div>`;
        } else {
          analysis = `<div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #64748b; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #334155;">${goal.charAt(0).toUpperCase() + goal.slice(1)} (${data.count} sessions, ${Math.round(data.duration)} minutes)</h4>
            <p>Users completed ${data.count} sessions targeting this therapeutic goal, with an average duration of ${Math.round(data.duration/data.count)} minutes per session.</p>
          </div>`;
        }
        
        return analysis;
      }).join('')}
  </div>

  <h2>Neuroplasticity & Long-Term Adaptation</h2>
  <div style="padding: 15px; background: #f0f9ff; border-left: 4px solid #0284c7; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #075985;">Mechanisms of Neural Change</h3>
    <p>Repeated binaural beat exposure induces experience-dependent neuroplasticity through multiple mechanisms:</p>
    <ol style="line-height: 1.8;">
      <li><strong>Hebbian Plasticity:</strong> Consistent entrainment strengthens synaptic connections in auditory-thalamocortical 
      pathways following the principle "neurons that fire together, wire together"</li>
      <li><strong>Long-Term Potentiation (LTP):</strong> Regular theta entrainment enhances hippocampal LTP, improving memory 
      consolidation and learning efficiency</li>
      <li><strong>Receptor Modulation:</strong> Chronic use modulates GABAergic, serotonergic, and dopaminergic receptor 
      density in target regions, producing lasting mood and cognitive benefits</li>
      <li><strong>White Matter Integrity:</strong> Extended practice may enhance myelination of relevant neural tracts, 
      improving signal transmission efficiency</li>
      <li><strong>Network Reorganization:</strong> Sustained engagement promotes large-scale functional connectivity changes, 
      optimizing brain network efficiency</li>
    </ol>
    
    <h3 style="color: #075985;">Evidence-Based Dosage Guidelines</h3>
    <p><strong>Minimum Effective Dose:</strong> Research indicates 15-20 minutes per session, 3-5 times weekly, sustained 
    for 4-8 weeks produces measurable neural and behavioral changes.</p>
    <p><strong>Current Platform Metrics:</strong></p>
    <ul>
      <li>Average session duration: ${avgDuration} minutes ${avgDuration >= 15 ? '✓ Meets efficacy threshold' : '⚠ Below recommended 15-minute minimum'}</li>
      <li>Sessions per user: ${(totalSessions / totalUsers).toFixed(1)} ${(totalSessions / totalUsers) >= 12 ? '✓ Adequate for neuroplastic changes' : '⚠ Encourage more frequent sessions'}</li>
      <li>Total exposure time: ${Math.round((totalSessions * avgDuration) / 60)} hours across all users</li>
    </ul>
    
    <h3 style="color: #075985;">Projected Outcomes Timeline</h3>
    <ul style="line-height: 1.8;">
      <li><strong>Week 1-2:</strong> Acute effects - Immediate mood changes, relaxation response, temporary cognitive enhancement</li>
      <li><strong>Week 3-4:</strong> Consolidation - Improved stress resilience, better sleep quality, enhanced focus capacity</li>
      <li><strong>Week 5-8:</strong> Neuroplastic changes - Measurable EEG alterations, sustained cognitive improvements, trait-level benefits</li>
      <li><strong>Month 3+:</strong> Long-term adaptation - Structural brain changes, optimized network connectivity, lasting psychological benefits</li>
    </ul>
  </div>

  <h2>AI-Generated Recommendations</h2>
  ${recommendations
    .map(
      (rec) => `
    <div class="recommendation recommendation-${rec.priority}">
      <h3 style="margin-top: 0; color: #1e293b;">${rec.title}</h3>
      <p style="margin-bottom: 0;">${rec.detail}</p>
      <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">
        ${rec.priority} priority
      </span>
    </div>
  `
    )
    .join('')}

  <h2>Survey Feedback Analysis</h2>
  <p>
    <strong>Total Responses:</strong> ${allSurveys.length}<br>
    <strong>Positive Feedback Rate:</strong> ${positiveRate}%<br>
    <strong>Interpretation:</strong> ${
      positiveRate > 70
        ? 'Users report high satisfaction with the neuroscience-based approach and binaural beat effectiveness.'
        : positiveRate > 50
        ? 'Moderate satisfaction indicates opportunity for improvement in user experience and personalization.'
        : 'Lower satisfaction suggests need for immediate intervention to improve platform effectiveness.'
    }
  </p>

  <h2>Key Scientific Insights</h2>
  <ul>
    <li><strong>Most Effective Frequency:</strong> ${Object.entries(frequencyMap).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'} shows highest user engagement</li>
    <li><strong>Primary Use Case:</strong> ${Object.entries(goalMap).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'} is the dominant user goal</li>
    <li><strong>Session Consistency:</strong> ${avgDuration > 20 ? 'Users demonstrate strong commitment with extended sessions' : 'Shorter sessions suggest need for improved engagement strategies'}</li>
    <li><strong>Neuroplasticity Impact:</strong> ${totalSessions > 100 ? 'High session volume supports potential for positive neuroplastic changes' : 'Encourage more frequent sessions for optimal brain training effects'}</li>
  </ul>

  <h2>Conclusion</h2>
  <p>
    ${
      engagementScore > 75
        ? `The Harmony platform demonstrates exceptional effectiveness in delivering neuroscience-based binaural beat therapy. 
           With an engagement score of ${engagementScore}/100, users are experiencing meaningful benefits and consistently returning 
           to the platform. The data suggests strong potential for continued growth and positive neurological outcomes.`
        : engagementScore > 50
        ? `The Harmony platform shows solid performance with good user engagement (${engagementScore}/100). There are clear 
           opportunities to enhance effectiveness through targeted improvements in personalization, user education, and 
           frequency selection algorithms.`
        : `The current engagement score of ${engagementScore}/100 indicates significant room for improvement. Implementing 
           the high-priority recommendations above will be crucial for enhancing user outcomes and platform effectiveness.`
    }
  </p>

  <div class="footer">
    <p>
      <strong>Harmony - Binaural Beat Therapy Platform</strong><br>
      Neuroscience-backed sound therapy for focus, relaxation, and cognitive enhancement<br>
      Report generated by AI-powered analytics engine
    </p>
  </div>
</body>
</html>
`;

    // In a production environment, you would use a library like puppeteer or similar to convert HTML to PDF
    // For now, we'll return the HTML as a response and let the client handle PDF generation
    // Or use a serverless function / external API for PDF generation
    
    // Simple approach: Return HTML that can be printed as PDF by browser
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="neuroscience-report-${new Date().toISOString().split('T')[0]}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating neuroscience report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
