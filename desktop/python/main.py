import json
import app

if __name__ == '__main__':
    metricsFile = open('../metrics.json')
    metricsData = json.load(metricsFile)
    app.init(metricsData)
    metricsFile.close()
