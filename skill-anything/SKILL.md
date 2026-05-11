# Skill-Anything
Convert any workflow, conversation log to Agent SKILL

把任何对话磨合好的工作流程转换成可复用的 Agent SKILL，规范模型输出，拒绝抽卡。

# PROMPT
```markdown
我们刚才的对话已经磨合出了完整的【SKILL功能】工作流程和输出标准。
请现在将这个过程整理成一个标准的 Agent Skill，要求如下:
1.创建完整的Skill文件夹结构
2.SKILL.md写清楚:Skill职责、触发场景、执行步骤、输出标准
3.references 文件夹放入我们确认过的所有格式要求和内容标准
4.scripts 文件夹写入可自动化的步骤 
5.assets 文件夹放入需要复用的模板文件
输出一个我可以直接安装使用的Skill文件夹，放在【指定文件夹路径】下。
如果你没有有关 Agent Skill 的任何知识，不知道如何编写符合规范的 Agent Skill，可以参考：
- https://agentskills.io/home（简要介绍）
- https://code.claude.com/docs/en/skills（详细介绍）
```
