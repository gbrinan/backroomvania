# Findings

## 2026-09-12 자료 확인

- [파일 기반 계획 방식](https://github.com/ahastudio/til/blob/main/ai/file-based-planning-workflow.md): 계획·발견·실행 기록을 분리하고 중요한 결정 전에 계획을 다시 읽는다. 원문의 tasks.md 역할은 작업공간 정본인 task_plan.md가 담당한다. 중복 계획 파일을 만들지 않는다.
- [사용자 공유 문서](https://docs.google.com/document/d/1WlMqHZy8Dc5W5Cbn4zHlQ1TewkF9E5W41L9MveMZjY4/edit): 제목은 ‘GPT-6 Astra로 만드는 첫 게임 기획과 제작 전 과정’. 커넥터로 본문을 읽었다. 공통 제작 공정과 23장 Legend of Mana풍 소형 RPG 예시를 구분한다. 문서에 나온 개발 도구·외부 주장 전체를 별도로 검증한 것은 아니다.
- 적용 원칙: 경험 목표 → 핵심 반복 행동 → 얇은 설계 → 작은 실험 → 사람 플레이테스트. 규칙은 목적·입력·상태·예외·검증으로 기술한다. 예시의 숲·편지·수치·플랫폼은 이번 게임의 확정 조건이 아니다.
- [Legend of Mana 공식 소개](https://mana.square-enix-games.com/en-gb/games/legend-of-mana)는 세계 지도 구성과 Land Creation을 설명한다. [Trials of Mana 공식 소개](https://mana.square-enix-games.com/en-us/games/trials-of-mana)는 성검전설 3의 리메이크임을 명시한다. 두 작품을 같은 레퍼런스로 취급하지 않는다.
- 기존 Runforyourlife-watchout-GIRLS-는 별도 1인칭 호러 저장소다. 사용자가 이번 대상이라고 지정하지 않았으므로 연결하거나 수정하지 않는다.

## 설계 가설과 반대 관점

- 고정된 연결 지형은 능력 획득 후 재방문의 의미를 전달하기 쉽다는 설계 가설이다. 아직 플레이 관찰 근거는 없다.
- 반대로 고정 지형에 익숙해지면 백룸의 불안이 줄어들 수 있다. 공간 구조의 학습은 보존하되 소리·조명·사건의 변화로 불안을 유지하는 안을 토론한다.
- 따뜻한 거점은 공포 뒤 안도를 만들 수 있지만 고립감을 약화할 수도 있다. 사용자의 공포 취향에 따라 조절한다.

원본 문서 전체는 저장소에 복사하지 않는다. 프로젝트에 필요한 해석과 출처만 기록한다.

## 2026-09-12 — 런던·박물관 확장 조사

- 사용자 확정 요구: 마계화된 셜록 홈즈 시대 런던, 빌리 더 키드, 면도날 살인마, 밤의 빅벤·런던 브릿지·대영박물관, 유물과 해당 문화의 신화 적이 있는 방에서 탈출.
- Higgsfield 설치 요청이 승인됐고 balance·models_get 호출에 성공했다. GPT Image 2의 이미지·참조 이미지 기능과 16:9·2:3 비율을 확인했다.
- [후네페르 사자의 서](https://www.britishmuseum.org/collection/object/Y_EA9901-3): 암미트의 악어 앞부분·사자 중간·하마 뒷부분 도상을 확인. 전투 패턴과 능력 보상은 창작한다.
- [아시리아 수호상](https://www.britishmuseum.org/visit/object-trails/collecting-and-empire-trail): 라마수는 궁전 출입구의 수호상이며 해당 조각의 1850년 입수를 확인. 본래 악신이라는 설정을 만들지 않고 게임의 왜곡된 수호자로 제안한다.
- [슈텐도지 두루마리](https://www.britishmuseum.org/collection/object/A_1881-1210-0-270): 관련 소장품을 확인. 세부 전시 위치는 역사적 복원이라고 주장하지 않는다.
- [런던 브릿지 연혁](https://www.cityoflondon.gov.uk/things-to-do/architecture/bridges): 중세 다리는 1831~1832년 철거되고 레니 설계 다리로 교체됐다. 이미지의 런던 브릿지는 빅토리아 시대 석조 다리로 표현한다.
- [그레이트 코트](https://www.britishmuseum.org/sites/default/files/2020-08/R2-Collecting-the-World_LPG.pdf): 현재 유리 지붕 공간은 2000년 개장. 빅토리아 시대 이미지에 넣지 않는다.
- [박물관 연혁](https://www.britishmuseum.org/about-us/british-museum-story/history): 원형 열람실은 1857년, 그레이트 코트는 2000년 개장. 이미지에서 두 공간을 혼동하지 않는다.
- [미노타우로스 도기](https://www.britishmuseum.org/collection/object/G_1866-0805-2): 테세우스와 미노타우로스 장면이 있는 붉은 그림 도기를 확인. 미궁 능력·전투는 창작이다.
- [영국 의회 기록](https://committees.parliament.uk/committee/301/speakers-advisory-committee-on-works-of-art/news/92193/january-artwork-of-the-month-the-elizabeth-tower-under-construction/): 시계탑 완공과 큰 종의 첫 타종은 1859년. 제13종은 창작이다.
- [PBS 연표](https://www.pbs.org/wgbh/americanexperience/features/billy-life-and-legend-billy-kid/): 빌리의 마지막 사건은 1881년. 1888년 런던 등장에는 창작 시간 균열 장치가 필요하다.
- 이미지 견적: GPT Image 2 / 1k / medium, 16:9 및 2:3 모두 1장 1크레딧. 12장 제출 성공. 최종 결과는 images/README.md와 생성 기록에서 확인한다.

## 분리 자산 제작

- 사용자 확정: 여성 기록복원사, 검·리볼버·유물 지팡이. 결정 정본: decisions/0004-separated-assets.md.
- Higgsfield models_get에서 gpt_image_2의 image 참조 입력, 2k, medium/high 지원 확인. 기존 작업 ID로 외형과 환경을 참조한다.
- 반대 관점: 무기마다 전신 애니메이션을 늘리면 방향×동작×무기만큼 수정 비용이 커진다. 첫 세트에서 실루엣을 검증한 후 몸·무기 레이어 분리 여부를 결정한다.
